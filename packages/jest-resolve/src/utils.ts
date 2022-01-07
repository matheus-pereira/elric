/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import chalk = require('chalk');
import type {Config} from '@elric/types';
import {ValidationError} from 'elric-validate';
import Resolver from './resolver';

const BULLET: string = chalk.bold('\u25cf ');
const DOCUMENTATION_NOTE = `  ${chalk.bold('Configuration Documentation:')}
  https://elricjs.io/docs/configuration
`;

const createValidationError = (message: string) =>
  new ValidationError(`${BULLET}Validation Error`, message, DOCUMENTATION_NOTE);

const replaceRootDirInPath = (
  rootDir: Config.Path,
  filePath: Config.Path,
): string => {
  if (!/^<rootDir>/.test(filePath)) {
    return filePath;
  }

  return path.resolve(
    rootDir,
    path.normalize('./' + filePath.substr('<rootDir>'.length)),
  );
};

const resolveWithPrefix = (
  resolver: string | undefined | null,
  {
    filePath,
    humanOptionName,
    optionName,
    prefix,
    requireResolveFunction,
    rootDir,
  }: {
    filePath: string;
    humanOptionName: string;
    optionName: string;
    prefix: string;
    requireResolveFunction: (moduleName: string) => string;
    rootDir: Config.Path;
  },
): string => {
  const fileName = replaceRootDirInPath(rootDir, filePath);
  let module = Resolver.findNodeModule(`${prefix}${fileName}`, {
    basedir: rootDir,
    resolver: resolver || undefined,
  });
  if (module) {
    return module;
  }

  try {
    return requireResolveFunction(`${prefix}${fileName}`);
  } catch {}

  module = Resolver.findNodeModule(fileName, {
    basedir: rootDir,
    resolver: resolver || undefined,
  });
  if (module) {
    return module;
  }

  try {
    return requireResolveFunction(fileName);
  } catch {}

  throw createValidationError(
    `  ${humanOptionName} ${chalk.bold(
      fileName,
    )} cannot be found. Make sure the ${chalk.bold(
      optionName,
    )} configuration option points to an existing node module.`,
  );
};

/**
 * Finds the test environment to use:
 *
 * 1. looks for elric-environment-<name> relative to project.
 * 1. looks for elric-environment-<name> relative to elric.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to elric.
 */
export const resolveTestEnvironment = ({
  rootDir,
  testEnvironment: filePath,
  // TODO: remove default in elric 28
  requireResolveFunction = require.resolve,
}: {
  rootDir: Config.Path;
  testEnvironment: string;
  requireResolveFunction?: (moduleName: string) => string;
}): string =>
  resolveWithPrefix(undefined, {
    filePath,
    humanOptionName: 'Test environment',
    optionName: 'testEnvironment',
    prefix: 'elric-environment-',
    requireResolveFunction,
    rootDir,
  });

/**
 * Finds the watch plugins to use:
 *
 * 1. looks for elric-watch-<name> relative to project.
 * 1. looks for elric-watch-<name> relative to elric.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to elric.
 */
export const resolveWatchPlugin = (
  resolver: string | undefined | null,
  {
    filePath,
    rootDir,
    // TODO: remove default in elric 28
    requireResolveFunction = require.resolve,
  }: {
    filePath: string;
    rootDir: Config.Path;
    requireResolveFunction?: (moduleName: string) => string;
  },
): string =>
  resolveWithPrefix(resolver, {
    filePath,
    humanOptionName: 'Watch plugin',
    optionName: 'watchPlugins',
    prefix: 'elric-watch-',
    requireResolveFunction,
    rootDir,
  });

/**
 * Finds the runner to use:
 *
 * 1. looks for elric-runner-<name> relative to project.
 * 1. looks for elric-runner-<name> relative to elric.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to elric.
 */
export const resolveRunner = (
  resolver: string | undefined | null,
  {
    filePath,
    rootDir,
    // TODO: remove default in elric 28
    requireResolveFunction = require.resolve,
  }: {
    filePath: string;
    rootDir: Config.Path;
    requireResolveFunction?: (moduleName: string) => string;
  },
): string =>
  resolveWithPrefix(resolver, {
    filePath,
    humanOptionName: 'elric Runner',
    optionName: 'runner',
    prefix: 'elric-runner-',
    requireResolveFunction,
    rootDir,
  });

export const resolveSequencer = (
  resolver: string | undefined | null,
  {
    filePath,
    rootDir,
    // TODO: remove default in elric 28
    requireResolveFunction = require.resolve,
  }: {
    filePath: string;
    rootDir: Config.Path;
    requireResolveFunction?: (moduleName: string) => string;
  },
): string =>
  resolveWithPrefix(resolver, {
    filePath,
    humanOptionName: 'elric Sequencer',
    optionName: 'testSequencer',
    prefix: 'elric-sequencer-',
    requireResolveFunction,
    rootDir,
  });
