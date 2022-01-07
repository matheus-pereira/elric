/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {runYarnInstall} from '../Utils';
import runelric from '../runelric';

test('browser resolver works', () => {
  const dir = path.resolve(__dirname, '../browser-resolver');
  runYarnInstall(dir);

  const {exitCode} = runelric('browser-resolver');

  expect(exitCode).toBe(0);
});
