/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {onNodeVersions} from '@elric/test-utils';
import {json as runWithJson} from '../runelric';

test('testResultsProcessor', () => {
  const processorPath = path.resolve(
    __dirname,
    '../test-results-processor/processor.js',
  );
  const {json} = runWithJson('test-results-processor', [
    '--json',
    `--testResultsProcessor=${processorPath}`,
  ]);
  expect(json.processed).toBe(true);
});

// The versions where vm.Module exists and commonjs with "exports" is not broken
onNodeVersions('>=12.16.0', () => {
  test('testResultsProcessor written in ESM', () => {
    const processorPath = path.resolve(
      __dirname,
      '../test-results-processor/processor.mjs',
    );
    const {json} = runWithJson('test-results-processor', [
      '--json',
      `--testResultsProcessor=${processorPath}`,
    ]);
    expect(json.processed).toBe(true);
  });
});
