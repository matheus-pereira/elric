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

const DIR = path.resolve(tmpdir(), 'elric-path-pattern-reporter-message');

beforeEach(() => cleanup(DIR));
afterEach(() => cleanup(DIR));

test('prints a message with path pattern at the end', () => {
  writeFiles(DIR, {
    '.watchmanconfig': '',
    '__tests__/a.test.js': `test('a', () => {});`,
    '__tests__/b.test.js': `test('b', () => {});`,
    'package.json': '{}',
  });
  let stderr;

  ({stderr} = runelric(DIR, ['a']));
  expect(stderr).toMatch('Ran all test suites matching /a/i');

  ({stderr} = runelric(DIR, ['a', 'b']));
  expect(stderr).toMatch('Ran all test suites matching /a|b/i');

  ({stderr} = runelric(DIR, ['--testPathPattern', 'a']));
  expect(stderr).toMatch('Ran all test suites matching /a/i');

  ({stderr} = runelric(DIR, ['--testPathPattern', 'a|b']));
  expect(stderr).toMatch('Ran all test suites matching /a|b/i');
});
