/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getResultHeader from './getResultHeader';
import {
  formatTestPath,
  getSummary,
  printDisplayName,
  relativePath,
  trimAndFormatPath,
} from './utils';

export type {Config} from '@elric/types';
export type {
  AggregatedResult,
  SnapshotSummary,
  TestResult,
} from '@elric/test-result';
export {default as BaseReporter} from './BaseReporter';
export {default as CoverageReporter} from './CoverageReporter';
export {default as DefaultReporter} from './DefaultReporter';
export {default as NotifyReporter} from './NotifyReporter';
export {default as SummaryReporter} from './SummaryReporter';
export {default as VerboseReporter} from './VerboseReporter';
export type {
  Context,
  Reporter,
  ReporterOnStartOptions,
  SummaryOptions,
  Test,
} from './types';
export const utils = {
  formatTestPath,
  getResultHeader,
  getSummary,
  printDisplayName,
  relativePath,
  trimAndFormatPath,
};
