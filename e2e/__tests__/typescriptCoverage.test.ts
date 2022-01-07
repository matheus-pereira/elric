/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {runYarnInstall} from '../Utils';
import runelric from '../runelric';

it('instruments and collects coverage for typescript files', () => {
  const dir = path.resolve(__dirname, '../typescript-coverage');
  runYarnInstall(dir);
  const {stdout} = runelric(dir, ['--coverage', '--no-cache'], {
    stripAnsi: true,
  });
  expect(wrap(stdout)).toMatchSnapshot();
});
