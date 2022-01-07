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

const DIR = path.resolve(tmpdir(), 'test-failure-exit-code-test');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('exits with a specified code when test fail', () => {
  writeFiles(DIR, {
    '__tests__/test.test.js': `test('test', () => { expect(1).toBe(2); });`,
    'package.json': JSON.stringify({
      elric: {testEnvironment: 'node', testFailureExitCode: 99},
    }),
  });

  let {exitCode} = runelric(DIR);
  expect(exitCode).toBe(99);

  ({exitCode} = runelric(DIR, ['--testFailureExitCode', '77']));
  expect(exitCode).toBe(77);

  writeFiles(DIR, {
    '__tests__/test.test.js': `test('test', () => { expect(1).toBe(2); });`,
    'package.json': JSON.stringify({
      elric: {testEnvironment: 'node'},
    }),
  });
  ({exitCode} = runelric(DIR));
  expect(exitCode).toBe(1);
});

test('exits with a specified code when bailing from a failed test', () => {
  writeFiles(DIR, {
    '__tests__/test.test.js': `test('test', () => { expect(1).toBe(2); });`,
    '__tests__/test2.test.js': `test('test2', () => { expect(1).toBe(2); });`,
    'package.json': JSON.stringify({
      elric: {testEnvironment: 'node', testFailureExitCode: 99},
    }),
  });

  let {exitCode} = runelric(DIR, ['--bail']);
  expect(exitCode).toBe(99);

  ({exitCode} = runelric(DIR, ['--bail', '--testFailureExitCode', '77']));
  expect(exitCode).toBe(77);

  writeFiles(DIR, {
    '__tests__/test.test.js': `test('test', () => { expect(1).toBe(2); });`,
    '__tests__/test2.test.js': `test('test2', () => { expect(1).toBe(2); });`,
    'package.json': JSON.stringify({
      elric: {testEnvironment: 'node'},
    }),
  });
  ({exitCode} = runelric(DIR));
  expect(exitCode).toBe(1);
});
