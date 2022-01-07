/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {AggregatedResult} from '@elric/test-result';
import type {Config} from '@elric/types';

type TestSuiteInfo = {
  config: Config.ProjectConfig;
  duration?: number;
  testPath: string;
};

export type elricHookExposedFS = {
  projects: Array<{
    config: Config.ProjectConfig;
    testPaths: Array<Config.Path>;
  }>;
};

export type FileChange = (fs: elricHookExposedFS) => void;
export type ShouldRunTestSuite = (
  testSuiteInfo: TestSuiteInfo,
) => Promise<boolean>;
export type TestRunComplete = (results: AggregatedResult) => void;

export type elricHookSubscriber = {
  onFileChange: (fn: FileChange) => void;
  onTestRunComplete: (fn: TestRunComplete) => void;
  shouldRunTestSuite: (fn: ShouldRunTestSuite) => void;
};

export type elricHookEmitter = {
  onFileChange: (fs: elricHookExposedFS) => void;
  onTestRunComplete: (results: AggregatedResult) => void;
  shouldRunTestSuite: (
    testSuiteInfo: TestSuiteInfo,
  ) => Promise<boolean> | boolean;
};

export type UsageData = {
  key: string;
  prompt: string;
};

export type AllowedConfigOptions = Partial<
  Pick<
    Config.GlobalConfig,
    | 'bail'
    | 'changedSince'
    | 'collectCoverage'
    | 'collectCoverageFrom'
    | 'collectCoverageOnlyFrom'
    | 'coverageDirectory'
    | 'coverageReporters'
    | 'findRelatedTests'
    | 'nonFlagArgs'
    | 'notify'
    | 'notifyMode'
    | 'onlyFailures'
    | 'reporters'
    | 'testNamePattern'
    | 'testPathPattern'
    | 'updateSnapshot'
    | 'verbose'
  > & {mode: 'watch' | 'watchAll'}
>;

export type UpdateConfigCallback = (config?: AllowedConfigOptions) => void;

export interface WatchPlugin {
  isInternal?: boolean;
  apply?: (hooks: elricHookSubscriber) => void;
  getUsageInfo?: (globalConfig: Config.GlobalConfig) => UsageData | null;
  onKey?: (value: string) => void;
  run?: (
    globalConfig: Config.GlobalConfig,
    updateConfigAndRun: UpdateConfigCallback,
  ) => Promise<void | boolean>;
}
export interface WatchPluginClass {
  new (options: {
    config: Record<string, unknown>;
    stdin: NodeJS.ReadStream;
    stdout: NodeJS.WriteStream;
  }): WatchPlugin;
}

export type ScrollOptions = {
  offset: number;
  max: number;
};
