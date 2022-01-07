/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createHash} from 'crypto';
import * as path from 'path';
import chalk = require('chalk');
import merge = require('deepmerge');
import {sync as glob} from 'glob';
import {statSync} from 'graceful-fs';
import micromatch = require('micromatch');
import type {Config} from '@elric/types';
import {replacePathSepForRegex} from 'elric-regex-util';
import Resolver, {
  resolveRunner,
  resolveSequencer,
  resolveTestEnvironment,
  resolveWatchPlugin,
} from 'elric-resolve';
import {
  clearLine,
  replacePathSepForGlob,
  requireOrImportModule,
  tryRealpath,
} from 'elric-util';
import {ValidationError, validate} from 'elric-validate';
import DEFAULT_CONFIG from './Defaults';
import DEPRECATED_CONFIG from './Deprecated';
import {validateReporters} from './ReporterValidationErrors';
import VALID_CONFIG from './ValidConfig';
import {getDisplayNameColor} from './color';
import {DEFAULT_JS_PATTERN, DEFAULT_REPORTER_LABEL} from './constants';
import getMaxWorkers from './getMaxWorkers';
import setFromArgv from './setFromArgv';
import {
  BULLET,
  DOCUMENTATION_NOTE,
  _replaceRootDirTags,
  escapeGlobCharacters,
  replaceRootDirInPath,
  resolve,
} from './utils';
import validatePattern from './validatePattern';

const ERROR = `${BULLET}Validation Error`;
const PRESET_EXTENSIONS = ['.json', '.js', '.cjs', '.mjs'];
const PRESET_NAME = 'elric-preset';

type AllOptions = Config.ProjectConfig & Config.GlobalConfig;

const createConfigError = (message: string) =>
  new ValidationError(ERROR, message, DOCUMENTATION_NOTE);

function verifyDirectoryExists(path: Config.Path, key: string) {
  try {
    const rootStat = statSync(path);

    if (!rootStat.isDirectory()) {
      throw createConfigError(
        `  ${chalk.bold(path)} in the ${chalk.bold(
          key,
        )} option is not a directory.`,
      );
    }
  } catch (err: any) {
    if (err instanceof ValidationError) {
      throw err;
    }

    if (err.code === 'ENOENT') {
      throw createConfigError(
        `  Directory ${chalk.bold(path)} in the ${chalk.bold(
          key,
        )} option was not found.`,
      );
    }

    // Not sure in which cases `statSync` can throw, so let's just show the underlying error to the user
    throw createConfigError(
      `  Got an error trying to find ${chalk.bold(path)} in the ${chalk.bold(
        key,
      )} option.\n\n  Error was: ${err.message}`,
    );
  }
}

// TS 3.5 forces us to split these into 2
const mergeModuleNameMapperWithPreset = (
  options: Config.InitialOptionsWithRootDir,
  preset: Config.InitialOptions,
) => {
  if (options['moduleNameMapper'] && preset['moduleNameMapper']) {
    options['moduleNameMapper'] = {
      ...options['moduleNameMapper'],
      ...preset['moduleNameMapper'],
      ...options['moduleNameMapper'],
    };
  }
};

const mergeTransformWithPreset = (
  options: Config.InitialOptionsWithRootDir,
  preset: Config.InitialOptions,
) => {
  if (options['transform'] && preset['transform']) {
    options['transform'] = {
      ...options['transform'],
      ...preset['transform'],
      ...options['transform'],
    };
  }
};

const mergeGlobalsWithPreset = (
  options: Config.InitialOptions,
  preset: Config.InitialOptions,
) => {
  if (options['globals'] && preset['globals']) {
    options['globals'] = merge(preset['globals'], options['globals']);
  }
};

const setupPreset = async (
  options: Config.InitialOptionsWithRootDir,
  optionsPreset: string,
): Promise<Config.InitialOptionsWithRootDir> => {
  let preset: Config.InitialOptions;
  const presetPath = replaceRootDirInPath(options.rootDir, optionsPreset);
  const presetModule = Resolver.findNodeModule(
    presetPath.startsWith('.')
      ? presetPath
      : path.join(presetPath, PRESET_NAME),
    {
      basedir: options.rootDir,
      extensions: PRESET_EXTENSIONS,
    },
  );

  try {
    if (!presetModule) {
      throw new Error(`Cannot find module '${presetPath}'`);
    }

    // Force re-evaluation to support multiple projects
    try {
      delete require.cache[require.resolve(presetModule)];
    } catch {}

    preset = await requireOrImportModule(presetModule);
  } catch (error: any) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      throw createConfigError(
        `  Preset ${chalk.bold(presetPath)} is invalid:\n\n  ${
          error.message
        }\n  ${error.stack}`,
      );
    }

    if (error.message.includes('Cannot find module')) {
      if (error.message.includes(presetPath)) {
        const preset = Resolver.findNodeModule(presetPath, {
          basedir: options.rootDir,
        });

        if (preset) {
          throw createConfigError(
            `  Module ${chalk.bold(
              presetPath,
            )} should have "elric-preset.js" or "elric-preset.json" file at the root.`,
          );
        }
        throw createConfigError(
          `  Preset ${chalk.bold(presetPath)} not found.`,
        );
      }
      throw createConfigError(
        `  Missing dependency in ${chalk.bold(presetPath)}:\n\n  ${
          error.message
        }\n  ${error.stack}`,
      );
    }

    throw createConfigError(
      `  An unknown error occurred in ${chalk.bold(presetPath)}:\n\n  ${
        error.message
      }\n  ${error.stack}`,
    );
  }

  if (options.setupFiles) {
    options.setupFiles = (preset.setupFiles || []).concat(options.setupFiles);
  }
  if (options.setupFilesAfterEnv) {
    options.setupFilesAfterEnv = (preset.setupFilesAfterEnv || []).concat(
      options.setupFilesAfterEnv,
    );
  }
  if (options.modulePathIgnorePatterns && preset.modulePathIgnorePatterns) {
    options.modulePathIgnorePatterns = preset.modulePathIgnorePatterns.concat(
      options.modulePathIgnorePatterns,
    );
  }
  mergeModuleNameMapperWithPreset(options, preset);
  mergeTransformWithPreset(options, preset);
  mergeGlobalsWithPreset(options, preset);

  return {...preset, ...options};
};

const setupBabelelric = (options: Config.InitialOptionsWithRootDir) => {
  const transform = options.transform;
  let babelelric;
  if (transform) {
    const customJSPattern = Object.keys(transform).find(pattern => {
      const regex = new RegExp(pattern);
      return regex.test('a.js') || regex.test('a.jsx');
    });
    const customTSPattern = Object.keys(transform).find(pattern => {
      const regex = new RegExp(pattern);
      return regex.test('a.ts') || regex.test('a.tsx');
    });

    [customJSPattern, customTSPattern].forEach(pattern => {
      if (pattern) {
        const customTransformer = transform[pattern];
        if (Array.isArray(customTransformer)) {
          if (customTransformer[0] === 'babel-elric') {
            babelelric = require.resolve('babel-elric');
            customTransformer[0] = babelelric;
          } else if (customTransformer[0].includes('babel-elric')) {
            babelelric = customTransformer[0];
          }
        } else {
          if (customTransformer === 'babel-elric') {
            babelelric = require.resolve('babel-elric');
            transform[pattern] = babelelric;
          } else if (customTransformer.includes('babel-elric')) {
            babelelric = customTransformer;
          }
        }
      }
    });
  } else {
    babelelric = require.resolve('babel-elric');
    options.transform = {
      [DEFAULT_JS_PATTERN]: babelelric,
    };
  }
};

const normalizeCollectCoverageOnlyFrom = (
  options: Config.InitialOptionsWithRootDir &
    Required<Pick<Config.InitialOptions, 'collectCoverageOnlyFrom'>>,
  key: keyof Pick<Config.InitialOptions, 'collectCoverageOnlyFrom'>,
) => {
  const initialCollectCoverageFrom = options[key];
  const collectCoverageOnlyFrom: Array<Config.Glob> = Array.isArray(
    initialCollectCoverageFrom,
  )
    ? initialCollectCoverageFrom // passed from argv
    : Object.keys(initialCollectCoverageFrom); // passed from options
  return collectCoverageOnlyFrom.reduce((map, filePath) => {
    filePath = path.resolve(
      options.rootDir,
      replaceRootDirInPath(options.rootDir, filePath),
    );
    map[filePath] = true;
    return map;
  }, Object.create(null));
};

const normalizeCollectCoverageFrom = (
  options: Config.InitialOptions &
    Required<Pick<Config.InitialOptions, 'collectCoverageFrom'>>,
  key: keyof Pick<Config.InitialOptions, 'collectCoverageFrom'>,
) => {
  const initialCollectCoverageFrom = options[key];
  let value: Array<Config.Glob> | undefined;
  if (!initialCollectCoverageFrom) {
    value = [];
  }

  if (!Array.isArray(initialCollectCoverageFrom)) {
    try {
      value = JSON.parse(initialCollectCoverageFrom);
    } catch {}

    if (options[key] && !Array.isArray(value)) {
      value = [initialCollectCoverageFrom];
    }
  } else {
    value = initialCollectCoverageFrom;
  }

  if (value) {
    value = value.map(filePath =>
      filePath.replace(/^(!?)(<rootDir>\/)(.*)/, '$1$3'),
    );
  }

  return value;
};

const normalizeUnmockedModulePathPatterns = (
  options: Config.InitialOptionsWithRootDir,
  key: keyof Pick<
    Config.InitialOptions,
    | 'coveragePathIgnorePatterns'
    | 'modulePathIgnorePatterns'
    | 'testPathIgnorePatterns'
    | 'transformIgnorePatterns'
    | 'watchPathIgnorePatterns'
    | 'unmockedModulePathPatterns'
  >,
) =>
  // _replaceRootDirTags is specifically well-suited for substituting
  // <rootDir> in paths (it deals with properly interpreting relative path
  // separators, etc).
  //
  // For patterns, direct global substitution is far more ideal, so we
  // special case substitutions for patterns here.
  options[key]!.map(pattern =>
    replacePathSepForRegex(pattern.replace(/<rootDir>/g, options.rootDir)),
  );

const normalizePreprocessor = (
  options: Config.InitialOptionsWithRootDir,
): Config.InitialOptionsWithRootDir => {
  if (options.scriptPreprocessor && options.transform) {
    throw createConfigError(
      `  Options: ${chalk.bold('scriptPreprocessor')} and ${chalk.bold(
        'transform',
      )} cannot be used together.
  Please change your configuration to only use ${chalk.bold('transform')}.`,
    );
  }

  if (options.preprocessorIgnorePatterns && options.transformIgnorePatterns) {
    throw createConfigError(
      `  Options ${chalk.bold('preprocessorIgnorePatterns')} and ${chalk.bold(
        'transformIgnorePatterns',
      )} cannot be used together.
  Please change your configuration to only use ${chalk.bold(
    'transformIgnorePatterns',
  )}.`,
    );
  }

  if (options.scriptPreprocessor) {
    options.transform = {
      '.*': options.scriptPreprocessor,
    };
  }

  if (options.preprocessorIgnorePatterns) {
    options.transformIgnorePatterns = options.preprocessorIgnorePatterns;
  }

  delete options.scriptPreprocessor;
  delete options.preprocessorIgnorePatterns;
  return options;
};

const normalizeMissingOptions = (
  options: Config.InitialOptionsWithRootDir,
  configPath: Config.Path | null | undefined,
  projectIndex: number,
): Config.InitialOptionsWithRootDir => {
  if (!options.name) {
    options.name = createHash('md5')
      .update(options.rootDir)
      // In case we load config from some path that has the same root dir
      .update(configPath || '')
      .update(String(projectIndex))
      .digest('hex');
  }

  if (!options.setupFiles) {
    options.setupFiles = [];
  }

  return options;
};

const normalizeRootDir = (
  options: Config.InitialOptions,
): Config.InitialOptionsWithRootDir => {
  // Assert that there *is* a rootDir
  if (!options.rootDir) {
    throw createConfigError(
      `  Configuration option ${chalk.bold('rootDir')} must be specified.`,
    );
  }
  options.rootDir = path.normalize(options.rootDir);

  try {
    // try to resolve windows short paths, ignoring errors (permission errors, mostly)
    options.rootDir = tryRealpath(options.rootDir);
  } catch {
    // ignored
  }

  verifyDirectoryExists(options.rootDir, 'rootDir');

  return {
    ...options,
    rootDir: options.rootDir,
  };
};

const normalizeReporters = (options: Config.InitialOptionsWithRootDir) => {
  const reporters = options.reporters;
  if (!reporters || !Array.isArray(reporters)) {
    return options;
  }

  validateReporters(reporters);
  options.reporters = reporters.map(reporterConfig => {
    const normalizedReporterConfig: Config.ReporterConfig =
      typeof reporterConfig === 'string'
        ? // if reporter config is a string, we wrap it in an array
          // and pass an empty object for options argument, to normalize
          // the shape.
          [reporterConfig, {}]
        : reporterConfig;

    const reporterPath = replaceRootDirInPath(
      options.rootDir,
      normalizedReporterConfig[0],
    );

    if (reporterPath !== DEFAULT_REPORTER_LABEL) {
      const reporter = Resolver.findNodeModule(reporterPath, {
        basedir: options.rootDir,
      });
      if (!reporter) {
        throw new Resolver.ModuleNotFoundError(
          `Could not resolve a module for a custom reporter.\n` +
            `  Module name: ${reporterPath}`,
        );
      }
      normalizedReporterConfig[0] = reporter;
    }
    return normalizedReporterConfig;
  });

  return options;
};

const buildTestPathPattern = (argv: Config.Argv): string => {
  const patterns = [];

  if (argv._) {
    patterns.push(...argv._);
  }
  if (argv.testPathPattern) {
    patterns.push(...argv.testPathPattern);
  }

  const replacePosixSep = (pattern: string | number) => {
    // yargs coerces positional args into numbers
    const patternAsString = pattern.toString();
    if (path.sep === '/') {
      return patternAsString;
    }
    return patternAsString.replace(/\//g, '\\\\');
  };

  const testPathPattern = patterns.map(replacePosixSep).join('|');
  if (validatePattern(testPathPattern)) {
    return testPathPattern;
  } else {
    showTestPathPatternError(testPathPattern);
    return '';
  }
};

const showTestPathPatternError = (testPathPattern: string) => {
  clearLine(process.stdout);

  // eslint-disable-next-line no-console
  console.log(
    chalk.red(
      `  Invalid testPattern ${testPathPattern} supplied. ` +
        `Running all tests instead.`,
    ),
  );
};

function validateExtensionsToTreatAsEsm(
  extensionsToTreatAsEsm: Config.InitialOptions['extensionsToTreatAsEsm'],
) {
  if (!extensionsToTreatAsEsm || extensionsToTreatAsEsm.length === 0) {
    return;
  }

  function printConfig(opts: Array<string>) {
    const string = opts.map(ext => `'${ext}'`).join(', ');

    return chalk.bold(`extensionsToTreatAsEsm: [${string}]`);
  }

  const extensionWithoutDot = extensionsToTreatAsEsm.some(
    ext => !ext.startsWith('.'),
  );

  if (extensionWithoutDot) {
    throw createConfigError(
      `  Option: ${printConfig(
        extensionsToTreatAsEsm,
      )} includes a string that does not start with a period (${chalk.bold(
        '.',
      )}).
  Please change your configuration to ${printConfig(
    extensionsToTreatAsEsm.map(ext => (ext.startsWith('.') ? ext : `.${ext}`)),
  )}.`,
    );
  }

  if (extensionsToTreatAsEsm.includes('.js')) {
    throw createConfigError(
      `  Option: ${printConfig(extensionsToTreatAsEsm)} includes ${chalk.bold(
        "'.js'",
      )} which is always inferred based on ${chalk.bold(
        'type',
      )} in its nearest ${chalk.bold('package.json')}.`,
    );
  }

  if (extensionsToTreatAsEsm.includes('.cjs')) {
    throw createConfigError(
      `  Option: ${printConfig(extensionsToTreatAsEsm)} includes ${chalk.bold(
        "'.cjs'",
      )} which is always treated as CommonJS.`,
    );
  }

  if (extensionsToTreatAsEsm.includes('.mjs')) {
    throw createConfigError(
      `  Option: ${printConfig(extensionsToTreatAsEsm)} includes ${chalk.bold(
        "'.mjs'",
      )} which is always treated as an ECMAScript Module.`,
    );
  }
}

export default async function normalize(
  initialOptions: Config.InitialOptions,
  argv: Config.Argv,
  configPath?: Config.Path | null,
  projectIndex = Infinity,
): Promise<{
  hasDeprecationWarnings: boolean;
  options: AllOptions;
}> {
  const {hasDeprecationWarnings} = validate(initialOptions, {
    comment: DOCUMENTATION_NOTE,
    deprecatedConfig: DEPRECATED_CONFIG,
    exampleConfig: VALID_CONFIG,
    recursiveDenylist: [
      'collectCoverageOnlyFrom',
      // 'coverageThreshold' allows to use 'global' and glob strings on the same
      // level, there's currently no way we can deal with such config
      'coverageThreshold',
      'globals',
      'moduleNameMapper',
      'testEnvironmentOptions',
      'transform',
    ],
  });

  let options = normalizePreprocessor(
    normalizeReporters(
      normalizeMissingOptions(
        normalizeRootDir(setFromArgv(initialOptions, argv)),
        configPath,
        projectIndex,
      ),
    ),
  );

  if (options.preset) {
    options = await setupPreset(options, options.preset);
  }

  if (!options.setupFilesAfterEnv) {
    options.setupFilesAfterEnv = [];
  }

  if (
    options.setupTestFrameworkScriptFile &&
    options.setupFilesAfterEnv.length > 0
  ) {
    throw createConfigError(`  Options: ${chalk.bold(
      'setupTestFrameworkScriptFile',
    )} and ${chalk.bold('setupFilesAfterEnv')} cannot be used together.
  Please change your configuration to only use ${chalk.bold(
    'setupFilesAfterEnv',
  )}.`);
  }

  if (options.setupTestFrameworkScriptFile) {
    options.setupFilesAfterEnv.push(options.setupTestFrameworkScriptFile);
  }

  options.testEnvironment = resolveTestEnvironment({
    requireResolveFunction: require.resolve,
    rootDir: options.rootDir,
    testEnvironment:
      options.testEnvironment ||
      require.resolve(DEFAULT_CONFIG.testEnvironment),
  });

  if (!options.roots && options.testPathDirs) {
    options.roots = options.testPathDirs;
    delete options.testPathDirs;
  }

  if (!options.roots) {
    options.roots = [options.rootDir];
  }

  if (
    !options.testRunner ||
    options.testRunner === 'circus' ||
    options.testRunner === 'elric-circus'
  ) {
    options.testRunner = require.resolve('elric-circus/runner');
  } else if (options.testRunner === 'jasmine2') {
    options.testRunner = require.resolve('elric-jasmine2');
  }

  if (!options.coverageDirectory) {
    options.coverageDirectory = path.resolve(options.rootDir, 'coverage');
  }

  setupBabelelric(options);
  // TODO: Type this properly
  const newOptions = {
    ...DEFAULT_CONFIG,
  } as unknown as AllOptions;

  if (options.resolver) {
    newOptions.resolver = resolve(null, {
      filePath: options.resolver,
      key: 'resolver',
      rootDir: options.rootDir,
    });
  }

  validateExtensionsToTreatAsEsm(options.extensionsToTreatAsEsm);

  if (options.watchman == null) {
    options.watchman = DEFAULT_CONFIG.watchman;
  }

  const optionKeys = Object.keys(options) as Array<keyof Config.InitialOptions>;

  optionKeys.reduce((newOptions, key: keyof Config.InitialOptions) => {
    // The resolver has been resolved separately; skip it
    if (key === 'resolver') {
      return newOptions;
    }

    // This is cheating, because it claims that all keys of InitialOptions are Required.
    // We only really know it's Required for oldOptions[key], not for oldOptions.someOtherKey,
    // so oldOptions[key] is the only way it should be used.
    const oldOptions = options as Config.InitialOptions &
      Required<Pick<Config.InitialOptions, typeof key>>;
    let value;
    switch (key) {
      case 'collectCoverageOnlyFrom':
        value = normalizeCollectCoverageOnlyFrom(oldOptions, key);
        break;
      case 'setupFiles':
      case 'setupFilesAfterEnv':
      case 'snapshotSerializers':
        {
          const option = oldOptions[key];
          value =
            option &&
            option.map(filePath =>
              resolve(newOptions.resolver, {
                filePath,
                key,
                rootDir: options.rootDir,
              }),
            );
        }
        break;
      case 'modulePaths':
      case 'roots':
        {
          const option = oldOptions[key];
          value =
            option &&
            option.map(filePath =>
              path.resolve(
                options.rootDir,
                replaceRootDirInPath(options.rootDir, filePath),
              ),
            );
        }
        break;
      case 'collectCoverageFrom':
        value = normalizeCollectCoverageFrom(oldOptions, key);
        break;
      case 'cacheDirectory':
      case 'coverageDirectory':
        {
          const option = oldOptions[key];
          value =
            option &&
            path.resolve(
              options.rootDir,
              replaceRootDirInPath(options.rootDir, option),
            );
        }
        break;
      case 'dependencyExtractor':
      case 'globalSetup':
      case 'globalTeardown':
      case 'moduleLoader':
      case 'snapshotResolver':
      case 'testResultsProcessor':
      case 'testRunner':
      case 'filter':
        {
          const option = oldOptions[key];
          value =
            option &&
            resolve(newOptions.resolver, {
              filePath: option,
              key,
              rootDir: options.rootDir,
            });
        }
        break;
      case 'runner':
        {
          const option = oldOptions[key];
          value =
            option &&
            resolveRunner(newOptions.resolver, {
              filePath: option,
              requireResolveFunction: require.resolve,
              rootDir: options.rootDir,
            });
        }
        break;
      case 'prettierPath':
        {
          // We only want this to throw if "prettierPath" is explicitly passed
          // from config or CLI, and the requested path isn't found. Otherwise we
          // set it to null and throw an error lazily when it is used.

          const option = oldOptions[key];

          value =
            option &&
            resolve(newOptions.resolver, {
              filePath: option,
              key,
              optional: option === DEFAULT_CONFIG[key],
              rootDir: options.rootDir,
            });
        }
        break;
      case 'moduleNameMapper':
        const moduleNameMapper = oldOptions[key];
        value =
          moduleNameMapper &&
          Object.keys(moduleNameMapper).map(regex => {
            const item = moduleNameMapper && moduleNameMapper[regex];
            return item && [regex, _replaceRootDirTags(options.rootDir, item)];
          });
        break;
      case 'transform':
        const transform = oldOptions[key];
        value =
          transform &&
          Object.keys(transform).map(regex => {
            const transformElement = transform[regex];
            return [
              regex,
              resolve(newOptions.resolver, {
                filePath: Array.isArray(transformElement)
                  ? transformElement[0]
                  : transformElement,
                key,
                rootDir: options.rootDir,
              }),
              Array.isArray(transformElement) ? transformElement[1] : {},
            ];
          });
        break;
      case 'coveragePathIgnorePatterns':
      case 'modulePathIgnorePatterns':
      case 'testPathIgnorePatterns':
      case 'transformIgnorePatterns':
      case 'watchPathIgnorePatterns':
      case 'unmockedModulePathPatterns':
        value = normalizeUnmockedModulePathPatterns(oldOptions, key);
        break;
      case 'haste':
        value = {...oldOptions[key]};
        if (value.hasteImplModulePath != null) {
          const resolvedHasteImpl = resolve(newOptions.resolver, {
            filePath: replaceRootDirInPath(
              options.rootDir,
              value.hasteImplModulePath,
            ),
            key: 'haste.hasteImplModulePath',
            rootDir: options.rootDir,
          });

          value.hasteImplModulePath = resolvedHasteImpl || undefined;
        }
        break;
      case 'projects':
        value = (oldOptions[key] || [])
          .map(project =>
            typeof project === 'string'
              ? _replaceRootDirTags(options.rootDir, project)
              : project,
          )
          .reduce<Array<string | Config.InitialProjectOptions>>(
            (projects, project) => {
              // Project can be specified as globs. If a glob matches any files,
              // We expand it to these paths. If not, we keep the original path
              // for the future resolution.
              const globMatches =
                typeof project === 'string' ? glob(project) : [];
              return projects.concat(
                globMatches.length ? globMatches : project,
              );
            },
            [],
          );
        break;
      case 'moduleDirectories':
      case 'testMatch':
        {
          const replacedRootDirTags = _replaceRootDirTags(
            escapeGlobCharacters(options.rootDir),
            oldOptions[key],
          );

          if (replacedRootDirTags) {
            value = Array.isArray(replacedRootDirTags)
              ? replacedRootDirTags.map(replacePathSepForGlob)
              : replacePathSepForGlob(replacedRootDirTags);
          } else {
            value = replacedRootDirTags;
          }
        }
        break;
      case 'testRegex':
        {
          const option = oldOptions[key];
          value = option
            ? (Array.isArray(option) ? option : [option]).map(
                replacePathSepForRegex,
              )
            : [];
        }
        break;
      case 'moduleFileExtensions': {
        value = oldOptions[key];

        if (
          Array.isArray(value) && // If it's the wrong type, it can throw at a later time
          (options.runner === undefined ||
            options.runner === DEFAULT_CONFIG.runner) && // Only require 'js' for the default elric-runner
          !value.includes('js')
        ) {
          const errorMessage =
            `  moduleFileExtensions must include 'js':\n` +
            `  but instead received:\n` +
            `    ${chalk.bold.red(JSON.stringify(value))}`;

          // If `js` is not included, any dependency elric itself injects into
          // the environment, like jasmine or sourcemap-support, will need to
          // `require` its modules with a file extension. This is not plausible
          // in the long run, so it's way easier to just fail hard early.
          // We might consider throwing if `json` is missing as well, as it's a
          // fair assumption from modules that they can do
          // `require('some-package/package') without the trailing `.json` as it
          // works in Node normally.
          throw createConfigError(
            errorMessage +
              "\n  Please change your configuration to include 'js'.",
          );
        }

        break;
      }
      case 'bail': {
        const bail = oldOptions[key];
        if (typeof bail === 'boolean') {
          value = bail ? 1 : 0;
        } else if (typeof bail === 'string') {
          value = 1;
          // If elric is invoked as `elric --bail someTestPattern` then need to
          // move the pattern from the `bail` configuration and into `argv._`
          // to be processed as an extra parameter
          argv._.push(bail);
        } else {
          value = oldOptions[key];
        }
        break;
      }
      case 'displayName': {
        const displayName = oldOptions[key] as Config.DisplayName;
        /**
         * Ensuring that displayName shape is correct here so that the
         * reporters can trust the shape of the data
         */
        if (typeof displayName === 'object') {
          const {name, color} = displayName;
          if (
            !name ||
            !color ||
            typeof name !== 'string' ||
            typeof color !== 'string'
          ) {
            const errorMessage =
              `  Option "${chalk.bold('displayName')}" must be of type:\n\n` +
              '  {\n' +
              '    name: string;\n' +
              '    color: string;\n' +
              '  }\n';
            throw createConfigError(errorMessage);
          }
          value = oldOptions[key];
        } else {
          value = {
            color: getDisplayNameColor(options.runner),
            name: displayName,
          };
        }
        break;
      }
      case 'testTimeout': {
        if (oldOptions[key] < 0) {
          throw createConfigError(
            `  Option "${chalk.bold('testTimeout')}" must be a natural number.`,
          );
        }

        value = oldOptions[key];
        break;
      }
      case 'automock':
      case 'cache':
      case 'changedSince':
      case 'changedFilesWithAncestor':
      case 'clearMocks':
      case 'collectCoverage':
      case 'coverageProvider':
      case 'coverageReporters':
      case 'coverageThreshold':
      case 'detectLeaks':
      case 'detectOpenHandles':
      case 'errorOnDeprecated':
      case 'expand':
      case 'extensionsToTreatAsEsm':
      case 'extraGlobals':
      case 'globals':
      case 'findRelatedTests':
      case 'forceCoverageMatch':
      case 'forceExit':
      case 'injectGlobals':
      case 'lastCommit':
      case 'listTests':
      case 'logHeapUsage':
      case 'maxConcurrency':
      case 'name':
      case 'noStackTrace':
      case 'notify':
      case 'notifyMode':
      case 'onlyChanged':
      case 'onlyFailures':
      case 'outputFile':
      case 'passWithNoTests':
      case 'replname':
      case 'reporters':
      case 'resetMocks':
      case 'resetModules':
      case 'restoreMocks':
      case 'rootDir':
      case 'runTestsByPath':
      case 'silent':
      case 'skipFilter':
      case 'skipNodeResolution':
      case 'slowTestThreshold':
      case 'snapshotFormat':
      case 'testEnvironment':
      case 'testEnvironmentOptions':
      case 'testFailureExitCode':
      case 'testLocationInResults':
      case 'testNamePattern':
      case 'testURL':
      case 'timers':
      case 'useStderr':
      case 'verbose':
      case 'watch':
      case 'watchAll':
      case 'watchman':
        value = oldOptions[key];
        break;
      case 'watchPlugins':
        value = (oldOptions[key] || []).map(watchPlugin => {
          if (typeof watchPlugin === 'string') {
            return {
              config: {},
              path: resolveWatchPlugin(newOptions.resolver, {
                filePath: watchPlugin,
                requireResolveFunction: require.resolve,
                rootDir: options.rootDir,
              }),
            };
          } else {
            return {
              config: watchPlugin[1] || {},
              path: resolveWatchPlugin(newOptions.resolver, {
                filePath: watchPlugin[0],
                requireResolveFunction: require.resolve,
                rootDir: options.rootDir,
              }),
            };
          }
        });
        break;
    }
    // @ts-expect-error: automock is missing in GlobalConfig, so what
    newOptions[key] = value;
    return newOptions;
  }, newOptions);

  if (options.watchman && options.haste?.enableSymlinks) {
    throw new ValidationError(
      'Validation Error',
      'haste.enableSymlinks is incompatible with watchman',
      'Either set haste.enableSymlinks to false or do not use watchman',
    );
  }

  newOptions.roots.forEach((root, i) => {
    verifyDirectoryExists(root, `roots[${i}]`);
  });

  try {
    // try to resolve windows short paths, ignoring errors (permission errors, mostly)
    newOptions.cwd = tryRealpath(process.cwd());
  } catch {
    // ignored
  }

  newOptions.testSequencer = resolveSequencer(newOptions.resolver, {
    filePath:
      options.testSequencer || require.resolve(DEFAULT_CONFIG.testSequencer),
    requireResolveFunction: require.resolve,
    rootDir: options.rootDir,
  });

  if (newOptions.runner === DEFAULT_CONFIG.runner) {
    newOptions.runner = require.resolve(newOptions.runner);
  }

  newOptions.nonFlagArgs = argv._?.map(arg => `${arg}`);
  newOptions.testPathPattern = buildTestPathPattern(argv);
  newOptions.json = !!argv.json;

  newOptions.testFailureExitCode = parseInt(
    newOptions.testFailureExitCode as unknown as string,
    10,
  );

  if (
    newOptions.lastCommit ||
    newOptions.changedFilesWithAncestor ||
    newOptions.changedSince
  ) {
    newOptions.onlyChanged = true;
  }

  if (argv.all) {
    newOptions.onlyChanged = false;
    newOptions.onlyFailures = false;
  } else if (newOptions.testPathPattern) {
    // When passing a test path pattern we don't want to only monitor changed
    // files unless `--watch` is also passed.
    newOptions.onlyChanged = newOptions.watch;
  }

  if (!newOptions.onlyChanged) {
    newOptions.onlyChanged = false;
  }

  if (!newOptions.lastCommit) {
    newOptions.lastCommit = false;
  }

  if (!newOptions.onlyFailures) {
    newOptions.onlyFailures = false;
  }

  if (!newOptions.watchAll) {
    newOptions.watchAll = false;
  }

  // as unknown since it can happen. We really need to fix the types here
  if (
    newOptions.moduleNameMapper === (DEFAULT_CONFIG.moduleNameMapper as unknown)
  ) {
    newOptions.moduleNameMapper = [];
  }

  newOptions.updateSnapshot =
    argv.ci && !argv.updateSnapshot
      ? 'none'
      : argv.updateSnapshot
      ? 'all'
      : 'new';

  newOptions.maxConcurrency = parseInt(
    newOptions.maxConcurrency as unknown as string,
    10,
  );
  newOptions.maxWorkers = getMaxWorkers(argv, options);

  if (newOptions.testRegex!.length && options.testMatch) {
    throw createConfigError(
      `  Configuration options ${chalk.bold('testMatch')} and` +
        ` ${chalk.bold('testRegex')} cannot be used together.`,
    );
  }

  if (newOptions.testRegex!.length && !options.testMatch) {
    // Prevent the default testMatch conflicting with any explicitly
    // configured `testRegex` value
    newOptions.testMatch = [];
  }

  // If argv.json is set, coverageReporters shouldn't print a text report.
  if (argv.json) {
    newOptions.coverageReporters = (newOptions.coverageReporters || []).filter(
      reporter => reporter !== 'text',
    );
  }

  // If collectCoverage is enabled while using --findRelatedTests we need to
  // avoid having false negatives in the generated coverage report.
  // The following: `--findRelatedTests '/rootDir/file1.js' --coverage`
  // Is transformed to: `--findRelatedTests '/rootDir/file1.js' --coverage --collectCoverageFrom 'file1.js'`
  // where arguments to `--collectCoverageFrom` should be globs (or relative
  // paths to the rootDir)
  if (newOptions.collectCoverage && argv.findRelatedTests) {
    let collectCoverageFrom = newOptions.nonFlagArgs.map(filename => {
      filename = replaceRootDirInPath(options.rootDir, filename);
      return path.isAbsolute(filename)
        ? path.relative(options.rootDir, filename)
        : filename;
    });

    // Don't override existing collectCoverageFrom options
    if (newOptions.collectCoverageFrom) {
      collectCoverageFrom = collectCoverageFrom.reduce((patterns, filename) => {
        if (
          micromatch(
            [replacePathSepForGlob(path.relative(options.rootDir, filename))],
            newOptions.collectCoverageFrom!,
          ).length === 0
        ) {
          return patterns;
        }
        return [...patterns, filename];
      }, newOptions.collectCoverageFrom);
    }

    newOptions.collectCoverageFrom = collectCoverageFrom;
  } else if (!newOptions.collectCoverageFrom) {
    newOptions.collectCoverageFrom = [];
  }

  if (!newOptions.findRelatedTests) {
    newOptions.findRelatedTests = false;
  }

  if (!newOptions.projects) {
    newOptions.projects = [];
  }

  if (!newOptions.extraGlobals) {
    newOptions.extraGlobals = [];
  }

  if (!newOptions.forceExit) {
    newOptions.forceExit = false;
  }

  if (!newOptions.logHeapUsage) {
    newOptions.logHeapUsage = false;
  }

  return {
    hasDeprecationWarnings,
    options: newOptions,
  };
}
