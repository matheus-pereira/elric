/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {iselricJasmineRun} from '@elric/test-utils';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

const cleanupRunnerStack = (stderr: string) =>
  wrap(
    stderr
      .split('\n')
      .filter(
        line =>
          !line.includes('packages/elric-jasmine2/build') &&
          !line.includes('packages/elric-circus/build'),
      )
      .join('\n'),
  );

test('print correct error message with nested test definitions outside describe', () => {
  const result = runelric('nested-test-definitions', ['outside']);

  expect(result.exitCode).toBe(1);

  const summary = extractSummary(result.stderr);

  expect(cleanupRunnerStack(summary.rest)).toMatchSnapshot();
});

test('print correct error message with nested test definitions inside describe', () => {
  const result = runelric('nested-test-definitions', ['within']);

  expect(result.exitCode).toBe(1);

  const summary = extractSummary(result.stderr);

  expect(cleanupRunnerStack(summary.rest)).toMatchSnapshot();
});

(iselricJasmineRun() ? test.skip : test)(
  'print correct message when nesting describe inside it',
  () => {
    const result = runelric('nested-test-definitions', ['nestedDescribeInTest']);

    expect(result.exitCode).toBe(1);

    expect(result.stderr).toContain(
      'Cannot nest a describe inside a test. Describe block "inner describe" cannot run because it is nested within "test".',
    );
  },
);

(iselricJasmineRun() ? test.skip : test)(
  'print correct message when nesting a hook inside it',
  () => {
    const result = runelric('nested-test-definitions', ['nestedHookInTest']);

    expect(result.exitCode).toBe(1);

    expect(result.stderr).toContain(
      'Hooks cannot be defined inside tests. Hook of type "beforeEach" is nested within "test".',
    );
  },
);
