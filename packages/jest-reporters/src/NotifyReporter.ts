/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import * as util from 'util';
import exit = require('exit');
import type {AggregatedResult} from '@elric/test-result';
import type {Config} from '@elric/types';
import {pluralize} from 'elric-util';
import BaseReporter from './BaseReporter';
import type {Context, TestSchedulerContext} from './types';

const isDarwin = process.platform === 'darwin';

const icon = path.resolve(__dirname, '../assets/elric_logo.png');

export default class NotifyReporter extends BaseReporter {
  private _notifier = loadNotifier();
  private _startRun: (globalConfig: Config.GlobalConfig) => unknown;
  private _globalConfig: Config.GlobalConfig;
  private _context: TestSchedulerContext;

  static readonly filename = __filename;

  constructor(
    globalConfig: Config.GlobalConfig,
    startRun: (globalConfig: Config.GlobalConfig) => unknown,
    context: TestSchedulerContext,
  ) {
    super();
    this._globalConfig = globalConfig;
    this._startRun = startRun;
    this._context = context;
  }

  onRunComplete(contexts: Set<Context>, result: AggregatedResult): void {
    const success =
      result.numFailedTests === 0 && result.numRuntimeErrorTestSuites === 0;

    const firstContext = contexts.values().next();

    const hasteFS =
      firstContext && firstContext.value && firstContext.value.hasteFS;

    let packageName;
    if (hasteFS != null) {
      // assuming root package.json is the first one
      const [filePath] = hasteFS.matchFiles('package.json');

      packageName =
        filePath != null
          ? hasteFS.getModuleName(filePath)
          : this._globalConfig.rootDir;
    } else {
      packageName = this._globalConfig.rootDir;
    }

    packageName = packageName != null ? `${packageName} - ` : '';

    const notifyMode = this._globalConfig.notifyMode;
    const statusChanged =
      this._context.previousSuccess !== success || this._context.firstRun;
    const testsHaveRun = result.numTotalTests !== 0;

    if (
      testsHaveRun &&
      success &&
      (notifyMode === 'always' ||
        notifyMode === 'success' ||
        notifyMode === 'success-change' ||
        (notifyMode === 'change' && statusChanged) ||
        (notifyMode === 'failure-change' && statusChanged))
    ) {
      const title = util.format('%s%d%% Passed', packageName, 100);
      const message = `${isDarwin ? '\u2705 ' : ''}${pluralize(
        'test',
        result.numPassedTests,
      )} passed`;

      this._notifier.notify({icon, message, timeout: false, title});
    } else if (
      testsHaveRun &&
      !success &&
      (notifyMode === 'always' ||
        notifyMode === 'failure' ||
        notifyMode === 'failure-change' ||
        (notifyMode === 'change' && statusChanged) ||
        (notifyMode === 'success-change' && statusChanged))
    ) {
      const failed = result.numFailedTests / result.numTotalTests;

      const title = util.format(
        '%s%d%% Failed',
        packageName,
        Math.ceil(Number.isNaN(failed) ? 0 : failed * 100),
      );
      const message = util.format(
        (isDarwin ? '\u26D4\uFE0F ' : '') + '%d of %d tests failed',
        result.numFailedTests,
        result.numTotalTests,
      );

      const watchMode = this._globalConfig.watch || this._globalConfig.watchAll;
      const restartAnswer = 'Run again';
      const quitAnswer = 'Exit tests';

      if (!watchMode) {
        this._notifier.notify({icon, message, timeout: false, title});
      } else {
        this._notifier.notify(
          {
            actions: [restartAnswer, quitAnswer],
            closeLabel: 'Close',
            icon,
            message,
            timeout: false,
            title,
          },
          (err, _, metadata) => {
            if (err || !metadata) {
              return;
            }
            if (metadata.activationValue === quitAnswer) {
              exit(0);
              return;
            }
            if (metadata.activationValue === restartAnswer) {
              this._startRun(this._globalConfig);
            }
          },
        );
      }
    }

    this._context.previousSuccess = success;
    this._context.firstRun = false;
  }
}

function loadNotifier(): typeof import('node-notifier') {
  try {
    return require('node-notifier');
  } catch (err: any) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }

    throw Error(
      'notify reporter requires optional peer dependency "node-notifier" but it was not found',
    );
  }
}
