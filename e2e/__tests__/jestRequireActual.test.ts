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

const DIR = path.resolve(tmpdir(), 'elric-require-actual-test');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('understands dependencies using elric.requireActual', () => {
  writeFiles(DIR, {
    '.watchmanconfig': '',
    '__tests__/a.test.js': `
      const a = elric.requireActual('../a');

      test('a', () => {});
    `,
    '__tests__/b.test.js': `test('b', () => {});`,
    'a.js': `module.exports = {}`,
    'package.json': JSON.stringify({elric: {}}),
  });

  let stdout;
  let stderr;
  ({stdout, stderr} = runelric(DIR, ['--findRelatedTests', 'a.js']));

  expect(stdout).not.toMatch('No tests found');
  expect(stderr).toMatch('PASS __tests__/a.test.js');
  expect(stderr).not.toMatch('PASS __tests__/b.test.js');

  // change to elric.requireActual
  writeFiles(DIR, {
    '__tests__/a.test.js': `
      const a = elric.requireActual('../a');

      test('a', () => {});
    `,
  });

  ({stderr, stdout} = runelric(DIR, ['--findRelatedTests', 'a.js']));
  expect(stdout).not.toMatch('No tests found');
  expect(stderr).toMatch('PASS __tests__/a.test.js');
  expect(stderr).not.toMatch('PASS __tests__/b.test.js');
});
