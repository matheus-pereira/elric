/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  AggregatedResult,
  SerializableError,
  TestCaseResult,
  TestResult,
} from '@elric/test-result';
import type {Config} from '@elric/types';
import type {FS as HasteFS, ModuleMap} from 'elric-haste-map';
import type Resolver from 'elric-resolve';
import type {worker} from './CoverageWorker';

export type ReporterOnStartOptions = {
  estimatedTime: number;
  showStatus: boolean;
};

export type Context = {
  config: Config.ProjectConfig;
  hasteFS: HasteFS;
  moduleMap: ModuleMap;
  resolver: Resolver;
};

export type Test = {
  context: Context;
  duration?: number;
  path: Config.Path;
};

export type CoverageWorker = {worker: typeof worker};

export type CoverageReporterOptions = {
  changedFiles?: Set<Config.Path>;
  sourcesRelatedToTestsInChangedFiles?: Set<Config.Path>;
};

export type CoverageReporterSerializedOptions = {
  changedFiles?: Array<Config.Path>;
  sourcesRelatedToTestsInChangedFiles?: Array<Config.Path>;
};

export type OnTestStart = (test: Test) => Promise<void>;
export type OnTestFailure = (
  test: Test,
  error: SerializableError,
) => Promise<unknown>;
export type OnTestSuccess = (
  test: Test,
  result: TestResult,
) => Promise<unknown>;

export interface Reporter {
  readonly onTestResult?: (
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult,
  ) => Promise<void> | void;
  readonly onTestFileResult?: (
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult,
  ) => Promise<void> | void;
  readonly onTestCaseResult?: (
    test: Test,
    testCaseResult: TestCaseResult,
  ) => Promise<void> | void;
  readonly onRunStart: (
    results: AggregatedResult,
    options: ReporterOnStartOptions,
  ) => Promise<void> | void;
  readonly onTestStart?: (test: Test) => Promise<void> | void;
  readonly onTestFileStart?: (test: Test) => Promise<void> | void;
  readonly onRunComplete: (
    contexts: Set<Context>,
    results: AggregatedResult,
  ) => Promise<void> | void;
  readonly getLastError: () => Error | void;
}

export type SummaryOptions = {
  currentTestCases?: Array<{test: Test; testCaseResult: TestCaseResult}>;
  estimatedTime?: number;
  roundTime?: boolean;
  width?: number;
};

export type TestRunnerOptions = {
  serial: boolean;
};

export type TestRunData = Array<{
  context: Context;
  matches: {allTests: number; tests: Array<Test>; total: number};
}>;

export type TestSchedulerContext = {
  firstRun: boolean;
  previousSuccess: boolean;
  changedFiles?: Set<Config.Path>;
};
