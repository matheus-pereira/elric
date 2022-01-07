/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {cleanup, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(tmpdir(), 'log_heap_usage_test');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('logs memory usage', () => {
  writeFiles(DIR, {
    '__tests__/a-banana.js': `test('banana', () => expect(1).toBe(1));`,
    'package.json': JSON.stringify({elric: {testEnvironment: 'node'}}),
  });

  const {stderr} = runelric(DIR, ['--logHeapUsage']);
  expect(stderr).toMatch(/PASS\s__tests__\/a-banana.js.*\d+ MB heap size/);
});
