/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import runelric from '../runelric';
const dir = path.resolve(__dirname, '../test-todo');

test('works with all statuses', () => {
  const result = runelric(dir, ['statuses.test.js']);
  expect(result.exitCode).toBe(1);
  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
});

test('shows error messages when called with no arguments', () => {
  const result = runelric(dir, ['todoNoArgs.test.js']);
  expect(result.exitCode).toBe(1);
  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
});

test('shows error messages when called with multiple arguments', () => {
  const result = runelric(dir, ['todoMultipleArgs.test.js']);
  expect(result.exitCode).toBe(1);
  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
});

test('shows error messages when called with invalid argument', () => {
  const result = runelric(dir, ['todoNonString.test.js']);
  expect(result.exitCode).toBe(1);
  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
});

test('shows todo messages when in verbose mode', () => {
  const result = runelric(dir, ['verbose.test.js', '--verbose']);
  expect(result.exitCode).toBe(0);
  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
});
