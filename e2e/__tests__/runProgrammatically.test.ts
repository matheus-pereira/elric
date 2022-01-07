/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'path';
import {run} from '../Utils';

const dir = resolve(__dirname, '..', 'run-programmatically');

test('run elric programmatically cjs', () => {
  const {stdout} = run(`node cjs.js --version`, dir);
  expect(stdout).toMatch(/\d{2}\.\d{1,2}\.\d{1,2}[\-\S]*-dev$/);
});

test('run elric programmatically esm', () => {
  const {stdout} = run(`node index.js --version`, dir);
  expect(stdout).toMatch(/\d{2}\.\d{1,2}\.\d{1,2}[\-\S]*-dev$/);
});
