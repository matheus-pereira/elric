/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary, runYarnInstall} from '../Utils';
import runelric from '../runelric';

const dir = path.resolve(__dirname, '../expect-async-matcher');

beforeAll(() => {
  runYarnInstall(dir);
});

test('works with passing tests', () => {
  const result = runelric(dir, ['success.test.js']);
  expect(result.exitCode).toBe(0);
});

test('shows the correct errors in stderr when failing tests', () => {
  const result = runelric(dir, ['failure.test.js']);

  expect(result.exitCode).toBe(1);

  const rest = extractSummary(result.stderr)
    .rest.split('\n')
    .filter(line => line.indexOf('packages/expect/build/index.js') === -1)
    .join('\n');

  expect(wrap(rest)).toMatchSnapshot();
});
