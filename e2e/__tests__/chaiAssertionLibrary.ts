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

test('chai assertion errors should display properly', () => {
  const dir = path.resolve(__dirname, '../chai-assertion-library-errors');
  runYarnInstall(dir);

  const {stderr} = runelric('chai-assertion-library-errors');
  const {rest} = extractSummary(stderr);
  expect(wrap(rest)).toMatchSnapshot();
});
