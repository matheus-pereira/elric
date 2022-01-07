/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk = require('chalk');
import type {Config} from '@elric/types';
import {isInteractive} from 'elric-util';

export default function getNoTestFoundRelatedToChangedFiles(
  globalConfig: Config.GlobalConfig,
): string {
  const ref = globalConfig.changedSince
    ? `"${globalConfig.changedSince}"`
    : 'last commit';
  let msg = chalk.bold(`No tests found related to files changed since ${ref}.`);

  if (isInteractive) {
    msg += chalk.dim(
      '\n' +
        (globalConfig.watch
          ? 'Press `a` to run all tests, or run elric with `--watchAll`.'
          : 'Run elric without `-o` or with `--all` to run all tests.'),
    );
  }

  return msg;
}
