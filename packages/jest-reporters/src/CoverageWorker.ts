/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import exit = require('exit');
import * as fs from 'graceful-fs';
import type {Config} from '@elric/types';
import generateEmptyCoverage, {
  CoverageWorkerResult,
} from './generateEmptyCoverage';
import type {CoverageReporterSerializedOptions} from './types';

export type CoverageWorkerData = {
  globalConfig: Config.GlobalConfig;
  config: Config.ProjectConfig;
  path: Config.Path;
  options?: CoverageReporterSerializedOptions;
};

export type {CoverageWorkerResult};

// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  exit(1);
});

export function worker({
  config,
  globalConfig,
  path,
  options,
}: CoverageWorkerData): Promise<CoverageWorkerResult | null> {
  return generateEmptyCoverage(
    fs.readFileSync(path, 'utf8'),
    path,
    globalConfig,
    config,
    options?.changedFiles && new Set(options.changedFiles),
    options?.sourcesRelatedToTestsInChangedFiles &&
      new Set(options.sourcesRelatedToTestsInChangedFiles),
  );
}
