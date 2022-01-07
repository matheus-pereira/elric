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

const DIR = path.resolve(tmpdir(), 'version-test');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('works with elric.config.js', () => {
  writeFiles(DIR, {
    '.watchmanconfig': '',
    'package.json': '{}',
  });

  const {exitCode, stdout, stderr} = runelric(DIR, ['--version']);
  expect(stdout).toMatch(/\d{2}\.\d{1,2}\.\d{1,2}[\-\S]*-dev$/);
  // Only version gets printed and nothing else
  expect(stdout.split(/\n/)).toHaveLength(1);
  expect(stderr).toBe('');
  expect(exitCode).toBe(0);
});
