/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {AggregatedResult, AssertionLocation} from '@elric/test-result';
import type {Config} from '@elric/types';
import {
  BaseWatchPlugin,
  elricHookSubscriber,
  UpdateConfigCallback,
  UsageData,
} from 'elric-watcher';
import FailedTestsInteractiveMode from '../FailedTestsInteractiveMode';

export default class FailedTestsInteractivePlugin extends BaseWatchPlugin {
  private _failedTestAssertions?: Array<AssertionLocation>;
  private readonly _manager = new FailedTestsInteractiveMode(this._stdout);

  apply(hooks: elricHookSubscriber): void {
    hooks.onTestRunComplete(results => {
      this._failedTestAssertions = this.getFailedTestAssertions(results);

      if (this._manager.isActive()) this._manager.updateWithResults(results);
    });
  }

  getUsageInfo(): UsageData | null {
    if (this._failedTestAssertions?.length) {
      return {key: 'i', prompt: 'run failing tests interactively'};
    }

    return null;
  }

  onKey(key: string): void {
    if (this._manager.isActive()) {
      this._manager.put(key);
    }
  }

  run(
    _: Config.GlobalConfig,
    updateConfigAndRun: UpdateConfigCallback,
  ): Promise<void> {
    return new Promise(resolve => {
      if (
        !this._failedTestAssertions ||
        this._failedTestAssertions.length === 0
      ) {
        resolve();
        return;
      }

      this._manager.run(this._failedTestAssertions, failure => {
        updateConfigAndRun({
          mode: 'watch',
          testNamePattern: failure ? `^${failure.fullName}$` : '',
          testPathPattern: failure?.path || '',
        });

        if (!this._manager.isActive()) {
          resolve();
        }
      });
    });
  }

  private getFailedTestAssertions(
    results: AggregatedResult,
  ): Array<AssertionLocation> {
    const failedTestPaths: Array<AssertionLocation> = [];

    if (
      // skip if no failed tests
      results.numFailedTests === 0 ||
      // skip if missing test results
      !results.testResults ||
      // skip if unmatched snapshots are present
      results.snapshot.unmatched
    ) {
      return failedTestPaths;
    }

    results.testResults.forEach(testResult => {
      testResult.testResults.forEach(result => {
        if (result.status === 'failed') {
          failedTestPaths.push({
            fullName: result.fullName,
            path: testResult.testFilePath,
          });
        }
      });
    });

    return failedTestPaths;
  }
}
