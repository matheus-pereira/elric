/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable local/prefer-spread-eventually */

import * as path from 'path';
import chalk = require('chalk');
import slash = require('slash');
import type {Config} from '@elric/types';
import type {IModuleMap} from 'elric-haste-map';
import {tryRealpath} from 'elric-util';
import ModuleNotFoundError from './ModuleNotFoundError';
import defaultResolver from './defaultResolver';
import {clearFsCache} from './fileWalkers';
import isBuiltinModule from './isBuiltinModule';
import nodeModulesPaths from './nodeModulesPaths';
import shouldLoadAsEsm, {clearCachedLookups} from './shouldLoadAsEsm';
import type {ResolverConfig} from './types';

type FindNodeModuleConfig = {
  basedir: Config.Path;
  browser?: boolean;
  conditions?: Array<string>;
  extensions?: Array<string>;
  moduleDirectory?: Array<string>;
  paths?: Array<Config.Path>;
  resolver?: Config.Path | null;
  rootDir?: Config.Path;
  throwIfNotFound?: boolean;
};

export type ResolveModuleConfig = {
  conditions?: Array<string>;
  skipNodeResolution?: boolean;
  paths?: Array<Config.Path>;
};

const NATIVE_PLATFORM = 'native';

// We might be inside a symlink.
const resolvedCwd = tryRealpath(process.cwd());
const {NODE_PATH} = process.env;
const nodePaths = NODE_PATH
  ? NODE_PATH.split(path.delimiter)
      .filter(Boolean)
      // The resolver expects absolute paths.
      .map(p => path.resolve(resolvedCwd, p))
  : undefined;

export default class Resolver {
  private readonly _options: ResolverConfig;
  private readonly _moduleMap: IModuleMap;
  private readonly _moduleIDCache: Map<string, string>;
  private readonly _moduleNameCache: Map<string, Config.Path>;
  private readonly _modulePathCache: Map<string, Array<Config.Path>>;
  private readonly _supportsNativePlatform: boolean;

  constructor(moduleMap: IModuleMap, options: ResolverConfig) {
    this._options = {
      defaultPlatform: options.defaultPlatform,
      extensions: options.extensions,
      hasCoreModules:
        options.hasCoreModules === undefined ? true : options.hasCoreModules,
      moduleDirectories: options.moduleDirectories || ['node_modules'],
      moduleNameMapper: options.moduleNameMapper,
      modulePaths: options.modulePaths,
      platforms: options.platforms,
      resolver: options.resolver,
      rootDir: options.rootDir,
    };
    this._supportsNativePlatform = options.platforms
      ? options.platforms.includes(NATIVE_PLATFORM)
      : false;
    this._moduleMap = moduleMap;
    this._moduleIDCache = new Map();
    this._moduleNameCache = new Map();
    this._modulePathCache = new Map();
  }

  static ModuleNotFoundError = ModuleNotFoundError;

  static tryCastModuleNotFoundError(
    error: unknown,
  ): ModuleNotFoundError | null {
    if (error instanceof ModuleNotFoundError) {
      return error as ModuleNotFoundError;
    }

    const casted = error as ModuleNotFoundError;
    if (casted.code === 'MODULE_NOT_FOUND') {
      return ModuleNotFoundError.duckType(casted);
    }

    return null;
  }

  static clearDefaultResolverCache(): void {
    clearFsCache();
    clearCachedLookups();
  }

  static findNodeModule(
    path: Config.Path,
    options: FindNodeModuleConfig,
  ): Config.Path | null {
    const resolver: typeof defaultResolver = options.resolver
      ? require(options.resolver)
      : defaultResolver;
    const paths = options.paths;

    try {
      return resolver(path, {
        basedir: options.basedir,
        browser: options.browser,
        conditions: options.conditions,
        defaultResolver,
        extensions: options.extensions,
        moduleDirectory: options.moduleDirectory,
        paths: paths ? (nodePaths || []).concat(paths) : nodePaths,
        rootDir: options.rootDir,
      });
    } catch (e: unknown) {
      if (options.throwIfNotFound) {
        throw e;
      }
    }
    return null;
  }

  // unstable as it should be replaced by https://github.com/nodejs/modules/issues/393, and we don't want people to use it
  static unstable_shouldLoadAsEsm = shouldLoadAsEsm;

  resolveModuleFromDirIfExists(
    dirname: Config.Path,
    moduleName: string,
    options?: ResolveModuleConfig,
  ): Config.Path | null {
    const paths = options?.paths || this._options.modulePaths;
    const moduleDirectory = this._options.moduleDirectories;
    const stringifiedOptions = options ? JSON.stringify(options) : '';
    const key = dirname + path.delimiter + moduleName + stringifiedOptions;
    const defaultPlatform = this._options.defaultPlatform;
    const extensions = this._options.extensions.slice();
    let module;

    if (this._supportsNativePlatform) {
      extensions.unshift(
        ...this._options.extensions.map(ext => '.' + NATIVE_PLATFORM + ext),
      );
    }
    if (defaultPlatform) {
      extensions.unshift(
        ...this._options.extensions.map(ext => '.' + defaultPlatform + ext),
      );
    }

    // 1. If we have already resolved this module for this directory name,
    // return a value from the cache.
    const cacheResult = this._moduleNameCache.get(key);
    if (cacheResult) {
      return cacheResult;
    }

    // 2. Check if the module is a haste module.
    module = this.getModule(moduleName);
    if (module) {
      this._moduleNameCache.set(key, module);
      return module;
    }

    // 3. Check if the module is a node module and resolve it based on
    // the node module resolution algorithm. If skipNodeResolution is given we
    // ignore all modules that look like node modules (ie. are not relative
    // requires). This enables us to speed up resolution when we build a
    // dependency graph because we don't have to look at modules that may not
    // exist and aren't mocked.
    const skipResolution =
      options && options.skipNodeResolution && !moduleName.includes(path.sep);

    const resolveNodeModule = (name: Config.Path, throwIfNotFound = false) => {
      if (this.isCoreModule(name)) {
        return name;
      }

      return Resolver.findNodeModule(name, {
        basedir: dirname,
        conditions: options?.conditions,
        extensions,
        moduleDirectory,
        paths,
        resolver: this._options.resolver,
        rootDir: this._options.rootDir,
        throwIfNotFound,
      });
    };

    if (!skipResolution) {
      module = resolveNodeModule(moduleName, Boolean(process.versions.pnp));

      if (module) {
        this._moduleNameCache.set(key, module);
        return module;
      }
    }

    // 4. Resolve "haste packages" which are `package.json` files outside of
    // `node_modules` folders anywhere in the file system.
    const parts = moduleName.split('/');
    const hastePackage = this.getPackage(parts.shift()!);
    if (hastePackage) {
      try {
        const module = path.join.apply(
          path,
          [path.dirname(hastePackage)].concat(parts),
        );
        // try resolving with custom resolver first to support extensions,
        // then fallback to require.resolve
        const resolvedModule =
          resolveNodeModule(module) || require.resolve(module);
        this._moduleNameCache.set(key, resolvedModule);
        return resolvedModule;
      } catch {}
    }

    return null;
  }

  resolveModule(
    from: Config.Path,
    moduleName: string,
    options?: ResolveModuleConfig,
  ): Config.Path {
    const dirname = path.dirname(from);
    const module =
      this.resolveStubModuleName(from, moduleName) ||
      this.resolveModuleFromDirIfExists(dirname, moduleName, options);
    if (module) return module;

    // 5. Throw an error if the module could not be found. `resolve.sync` only
    // produces an error based on the dirname but we have the actual current
    // module name available.
    const relativePath =
      slash(path.relative(this._options.rootDir, from)) || '.';

    throw new ModuleNotFoundError(
      `Cannot find module '${moduleName}' from '${relativePath}'`,
      moduleName,
    );
  }

  private _isAliasModule(moduleName: string): boolean {
    const moduleNameMapper = this._options.moduleNameMapper;
    if (!moduleNameMapper) {
      return false;
    }

    return moduleNameMapper.some(({regex}) => regex.test(moduleName));
  }

  isCoreModule(moduleName: string): boolean {
    return (
      this._options.hasCoreModules &&
      (isBuiltinModule(moduleName) ||
        (moduleName.startsWith('node:') &&
          isBuiltinModule(moduleName.slice('node:'.length)))) &&
      !this._isAliasModule(moduleName)
    );
  }

  getModule(name: string): Config.Path | null {
    return this._moduleMap.getModule(
      name,
      this._options.defaultPlatform,
      this._supportsNativePlatform,
    );
  }

  getModulePath(from: Config.Path, moduleName: string): Config.Path {
    if (moduleName[0] !== '.' || path.isAbsolute(moduleName)) {
      return moduleName;
    }
    return path.normalize(path.dirname(from) + '/' + moduleName);
  }

  getPackage(name: string): Config.Path | null {
    return this._moduleMap.getPackage(
      name,
      this._options.defaultPlatform,
      this._supportsNativePlatform,
    );
  }

  getMockModule(from: Config.Path, name: string): Config.Path | null {
    const mock = this._moduleMap.getMockModule(name);
    if (mock) {
      return mock;
    } else {
      const moduleName = this.resolveStubModuleName(from, name);
      if (moduleName) {
        return this.getModule(moduleName) || moduleName;
      }
    }
    return null;
  }

  getModulePaths(from: Config.Path): Array<Config.Path> {
    const cachedModule = this._modulePathCache.get(from);
    if (cachedModule) {
      return cachedModule;
    }

    const moduleDirectory = this._options.moduleDirectories;
    const paths = nodeModulesPaths(from, {moduleDirectory});
    if (paths[paths.length - 1] === undefined) {
      // circumvent node-resolve bug that adds `undefined` as last item.
      paths.pop();
    }
    this._modulePathCache.set(from, paths);
    return paths;
  }

  getModuleID(
    virtualMocks: Map<string, boolean>,
    from: Config.Path,
    moduleName = '',
    options?: ResolveModuleConfig,
  ): string {
    const stringifiedOptions = options ? JSON.stringify(options) : '';
    const key = from + path.delimiter + moduleName + stringifiedOptions;
    const cachedModuleID = this._moduleIDCache.get(key);
    if (cachedModuleID) {
      return cachedModuleID;
    }

    const moduleType = this._getModuleType(moduleName);
    const absolutePath = this._getAbsolutePath(
      virtualMocks,
      from,
      moduleName,
      options,
    );
    const mockPath = this._getMockPath(from, moduleName);

    const sep = path.delimiter;
    const id =
      moduleType +
      sep +
      (absolutePath ? absolutePath + sep : '') +
      (mockPath ? mockPath + sep : '') +
      (stringifiedOptions ? stringifiedOptions + sep : '');

    this._moduleIDCache.set(key, id);
    return id;
  }

  private _getModuleType(moduleName: string): 'node' | 'user' {
    return this.isCoreModule(moduleName) ? 'node' : 'user';
  }

  private _getAbsolutePath(
    virtualMocks: Map<string, boolean>,
    from: Config.Path,
    moduleName: string,
    options?: ResolveModuleConfig,
  ): Config.Path | null {
    if (this.isCoreModule(moduleName)) {
      return moduleName;
    }
    return this._isModuleResolved(from, moduleName)
      ? this.getModule(moduleName)
      : this._getVirtualMockPath(virtualMocks, from, moduleName, options);
  }

  private _getMockPath(
    from: Config.Path,
    moduleName: string,
  ): Config.Path | null {
    return !this.isCoreModule(moduleName)
      ? this.getMockModule(from, moduleName)
      : null;
  }

  private _getVirtualMockPath(
    virtualMocks: Map<string, boolean>,
    from: Config.Path,
    moduleName: string,
    options?: ResolveModuleConfig,
  ): Config.Path {
    const virtualMockPath = this.getModulePath(from, moduleName);
    return virtualMocks.get(virtualMockPath)
      ? virtualMockPath
      : moduleName
      ? this.resolveModule(from, moduleName, options)
      : from;
  }

  private _isModuleResolved(from: Config.Path, moduleName: string): boolean {
    return !!(
      this.getModule(moduleName) || this.getMockModule(from, moduleName)
    );
  }

  resolveStubModuleName(
    from: Config.Path,
    moduleName: string,
  ): Config.Path | null {
    const dirname = path.dirname(from);
    const paths = this._options.modulePaths;
    const extensions = this._options.extensions.slice();
    const moduleDirectory = this._options.moduleDirectories;
    const moduleNameMapper = this._options.moduleNameMapper;
    const resolver = this._options.resolver;
    const defaultPlatform = this._options.defaultPlatform;

    if (this._supportsNativePlatform) {
      extensions.unshift(
        ...this._options.extensions.map(ext => '.' + NATIVE_PLATFORM + ext),
      );
    }

    if (defaultPlatform) {
      extensions.unshift(
        ...this._options.extensions.map(ext => '.' + defaultPlatform + ext),
      );
    }

    if (moduleNameMapper) {
      for (const {moduleName: mappedModuleName, regex} of moduleNameMapper) {
        if (regex.test(moduleName)) {
          // Note: once a moduleNameMapper matches the name, it must result
          // in a module, or else an error is thrown.
          const matches = moduleName.match(regex);
          const mapModuleName = matches
            ? (moduleName: string) =>
                moduleName.replace(
                  /\$([0-9]+)/g,
                  (_, index) => matches[parseInt(index, 10)],
                )
            : (moduleName: string) => moduleName;

          const possibleModuleNames = Array.isArray(mappedModuleName)
            ? mappedModuleName
            : [mappedModuleName];
          let module: string | null = null;
          for (const possibleModuleName of possibleModuleNames) {
            const updatedName = mapModuleName(possibleModuleName);

            module =
              this.getModule(updatedName) ||
              Resolver.findNodeModule(updatedName, {
                basedir: dirname,
                extensions,
                moduleDirectory,
                paths,
                resolver,
                rootDir: this._options.rootDir,
              });

            if (module) {
              break;
            }
          }

          if (!module) {
            throw createNoMappedModuleFoundError(
              moduleName,
              mapModuleName,
              mappedModuleName,
              regex,
              resolver,
            );
          }
          return module;
        }
      }
    }
    return null;
  }
}

const createNoMappedModuleFoundError = (
  moduleName: string,
  mapModuleName: (moduleName: string) => string,
  mappedModuleName: string | Array<string>,
  regex: RegExp,
  resolver?: ((...args: Array<unknown>) => unknown) | string | null,
) => {
  const mappedAs = Array.isArray(mappedModuleName)
    ? JSON.stringify(mappedModuleName.map(mapModuleName), null, 2)
    : mappedModuleName;
  const original = Array.isArray(mappedModuleName)
    ? JSON.stringify(mappedModuleName, null, 6) // using 6 because of misalignment when nested below
        .slice(0, -1) + '    ]' /// align last bracket correctly as well
    : mappedModuleName;

  const error = new Error(
    chalk.red(`${chalk.bold('Configuration error')}:

Could not locate module ${chalk.bold(moduleName)} mapped as:
${chalk.bold(mappedAs)}.

Please check your configuration for these entries:
{
  "moduleNameMapper": {
    "${regex.toString()}": "${chalk.bold(original)}"
  },
  "resolver": ${chalk.bold(String(resolver))}
}`),
  );

  error.name = '';

  return error;
};
