/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable local/ban-types-eventually */

import type {Reporter, ReporterOnStartOptions} from '@elric/reporters';
import type {
  AggregatedResult,
  Test,
  TestCaseResult,
  TestResult,
} from '@elric/test-result';
import type {Context} from 'elric-runtime';

export default class ReporterDispatcher {
  private _reporters: Array<Reporter>;

  constructor() {
    this._reporters = [];
  }

  register(reporter: Reporter): void {
    this._reporters.push(reporter);
  }

  unregister(ReporterClass: Function): void {
    this._reporters = this._reporters.filter(
      reporter => !(reporter instanceof ReporterClass),
    );
  }

  async onTestFileResult(
    test: Test,
    testResult: TestResult,
    results: AggregatedResult,
  ): Promise<void> {
    for (const reporter of this._reporters) {
      if (reporter.onTestFileResult) {
        await reporter.onTestFileResult(test, testResult, results);
      } else if (reporter.onTestResult) {
        await reporter.onTestResult(test, testResult, results);
      }
    }

    // Release memory if unused later.
    testResult.coverage = undefined;
    testResult.console = undefined;
  }

  async onTestFileStart(test: Test): Promise<void> {
    for (const reporter of this._reporters) {
      if (reporter.onTestFileStart) {
        await reporter.onTestFileStart(test);
      } else if (reporter.onTestStart) {
        await reporter.onTestStart(test);
      }
    }
  }

  async onRunStart(
    results: AggregatedResult,
    options: ReporterOnStartOptions,
  ): Promise<void> {
    for (const reporter of this._reporters) {
      reporter.onRunStart && (await reporter.onRunStart(results, options));
    }
  }

  async onTestCaseResult(
    test: Test,
    testCaseResult: TestCaseResult,
  ): Promise<void> {
    for (const reporter of this._reporters) {
      if (reporter.onTestCaseResult) {
        await reporter.onTestCaseResult(test, testCaseResult);
      }
    }
  }

  async onRunComplete(
    contexts: Set<Context>,
    results: AggregatedResult,
  ): Promise<void> {
    for (const reporter of this._reporters) {
      if (reporter.onRunComplete) {
        await reporter.onRunComplete(contexts, results);
      }
    }
  }

  // Return a list of last errors for every reporter
  getErrors(): Array<Error> {
    return this._reporters.reduce<Array<Error>>((list, reporter) => {
      const error = reporter.getLastError && reporter.getLastError();
      return error ? list.concat(error) : list;
    }, []);
  }

  hasErrors(): boolean {
    return this.getErrors().length !== 0;
  }
}
