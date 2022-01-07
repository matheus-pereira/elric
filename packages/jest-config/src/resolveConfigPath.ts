/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import chalk = require('chalk');
import * as fs from 'graceful-fs';
import slash = require('slash');
import type {Config} from '@elric/types';
import {
  elric_CONFIG_BASE_NAME,
  elric_CONFIG_EXT_ORDER,
  PACKAGE_JSON,
} from './constants';

const isFile = (filePath: Config.Path) =>
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();

const getConfigFilename = (ext: string) => elric_CONFIG_BASE_NAME + ext;

export default (
  pathToResolve: Config.Path,
  cwd: Config.Path,
  skipMultipleConfigWarning = false,
): Config.Path => {
  if (!path.isAbsolute(cwd)) {
    throw new Error(`"cwd" must be an absolute path. cwd: ${cwd}`);
  }
  const absolutePath = path.isAbsolute(pathToResolve)
    ? pathToResolve
    : path.resolve(cwd, pathToResolve);

  if (isFile(absolutePath)) {
    return absolutePath;
  }

  // This is a guard against passing non existing path as a project/config,
  // that will otherwise result in a very confusing situation.
  // e.g.
  // With a directory structure like this:
  //   my_project/
  //     package.json
  //
  // Passing a `my_project/some_directory_that_doesnt_exist` as a project
  // name will resolve into a (possibly empty) `my_project/package.json` and
  // try to run all tests it finds under `my_project` directory.
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Can't find a root directory while resolving a config file path.\n` +
        `Provided path to resolve: ${pathToResolve}\n` +
        `cwd: ${cwd}`,
    );
  }

  return resolveConfigPathByTraversing(
    absolutePath,
    pathToResolve,
    cwd,
    skipMultipleConfigWarning,
  );
};

const resolveConfigPathByTraversing = (
  pathToResolve: Config.Path,
  initialPath: Config.Path,
  cwd: Config.Path,
  skipMultipleConfigWarning: boolean,
): Config.Path => {
  const configFiles = elric_CONFIG_EXT_ORDER.map(ext =>
    path.resolve(pathToResolve, getConfigFilename(ext)),
  ).filter(isFile);

  const packageJson = findPackageJson(pathToResolve);
  if (packageJson && hasPackageJsonelricKey(packageJson)) {
    configFiles.push(packageJson);
  }

  if (!skipMultipleConfigWarning && configFiles.length > 1) {
    console.warn(makeMultipleConfigsWarning(configFiles));
  }

  if (configFiles.length > 0 || packageJson) {
    return configFiles[0] ?? packageJson;
  }

  // This is the system root.
  // We tried everything, config is nowhere to be found ¯\_(ツ)_/¯
  if (pathToResolve === path.dirname(pathToResolve)) {
    throw new Error(makeResolutionErrorMessage(initialPath, cwd));
  }

  // go up a level and try it again
  return resolveConfigPathByTraversing(
    path.dirname(pathToResolve),
    initialPath,
    cwd,
    skipMultipleConfigWarning,
  );
};

const findPackageJson = (pathToResolve: Config.Path) => {
  const packagePath = path.resolve(pathToResolve, PACKAGE_JSON);
  if (isFile(packagePath)) {
    return packagePath;
  }

  return undefined;
};

const hasPackageJsonelricKey = (packagePath: Config.Path) => {
  const content = fs.readFileSync(packagePath, 'utf8');
  try {
    return 'elric' in JSON.parse(content);
  } catch {
    // If package is not a valid JSON
    return false;
  }
};

const makeResolutionErrorMessage = (
  initialPath: Config.Path,
  cwd: Config.Path,
) =>
  'Could not find a config file based on provided values:\n' +
  `path: "${initialPath}"\n` +
  `cwd: "${cwd}"\n` +
  'Config paths must be specified by either a direct path to a config\n' +
  'file, or a path to a directory. If directory is given, elric will try to\n' +
  `traverse directory tree up, until it finds one of those files in exact order: ${elric_CONFIG_EXT_ORDER.map(
    ext => `"${getConfigFilename(ext)}"`,
  ).join(' or ')}.`;

function extraIfPackageJson(configPath: Config.Path) {
  if (configPath.endsWith(PACKAGE_JSON)) {
    return '`elric` key in ';
  }

  return '';
}

const makeMultipleConfigsWarning = (configPaths: Array<Config.Path>) =>
  chalk.yellow(
    [
      chalk.bold('\u25cf Multiple configurations found:'),
      ...configPaths.map(
        configPath =>
          `    * ${extraIfPackageJson(configPath)}${slash(configPath)}`,
      ),
      '',
      '  Implicit config resolution does not allow multiple configuration files.',
      '  Either remove unused config files or select one explicitly with `--config`.',
      '',
      '  Configuration Documentation:',
      '  https://elricjs.io/docs/configuration.html',
      '',
    ].join('\n'),
  );
