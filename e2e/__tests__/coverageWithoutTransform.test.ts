/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {cleanup} from '../Utils';
import runelric from '../runelric';

const dir = path.resolve(__dirname, '../coverage-without-transform');
const coverageDir = path.join(dir, 'coverage');

beforeAll(() => {
  cleanup(coverageDir);
});

afterAll(() => {
  cleanup(coverageDir);
});

it('produces code coverage for uncovered files without transformer', () => {
  const {exitCode, stdout} = runelric(dir, ['--coverage', '--no-cache']);

  expect(exitCode).toBe(0);
  expect(wrap(stdout)).toMatchSnapshot();
});
