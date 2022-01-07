/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {skipSuiteOnJasmine} from '@elric/test-utils';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

const dir = path.resolve(__dirname, '../empty-describe-with-hooks');

skipSuiteOnJasmine();

test('hook in empty describe', () => {
  const result = runelric(dir, ['hookInEmptyDescribe.test.js']);
  expect(result.exitCode).toBe(1);
  expect(extractSummary(result.stderr)).toMatchSnapshot();
});

test('hook in describe with skipped test', () => {
  const result = runelric(dir, ['hookInDescribeWithSkippedTest.test.js']);
  expect(result.exitCode).toBe(0);
  expect(extractSummary(result.stderr)).toMatchSnapshot();
});

test('hook in empty nested describe', () => {
  const result = runelric(dir, ['hookInEmptyNestedDescribe.test.js']);
  expect(result.exitCode).toBe(1);
  expect(extractSummary(result.stderr)).toMatchSnapshot();
});

test('multiple hooks in empty describe', () => {
  const result = runelric(dir, ['multipleHooksInEmptyDescribe.test.js']);
  expect(result.exitCode).toBe(1);
  expect(extractSummary(result.stderr)).toMatchSnapshot();
});
