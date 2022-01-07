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

const DIR = path.resolve(tmpdir(), 'elric_environment_jsdom_test');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('check is not leaking memory', () => {
  writeFiles(DIR, {
    '__tests__/a.test.js': `test('a', () => console.log('a'));`,
    '__tests__/b.test.js': `test('b', () => console.log('b'));`,
    'package.json': JSON.stringify({elric: {testEnvironment: 'jsdom'}}),
  });

  const {stderr} = runelric(DIR, ['--detect-leaks', '--runInBand']);
  expect(stderr).toMatch(/PASS\s__tests__\/a.test.js/);
  expect(stderr).toMatch(/PASS\s__tests__\/b.test.js/);
});
