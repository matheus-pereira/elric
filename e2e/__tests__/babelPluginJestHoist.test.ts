/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {runYarnInstall} from '../Utils';
import {json as runWithJson} from '../runelric';

const DIR = path.resolve(__dirname, '..', 'babel-plugin-elric-hoist');

beforeEach(() => {
  runYarnInstall(DIR);
});

it('successfully runs the tests inside `babel-plugin-elric-hoist/`', () => {
  const {json} = runWithJson(DIR, ['--no-cache', '--coverage']);
  expect(json.success).toBe(true);
  expect(json.numTotalTestSuites).toBe(4);
});
