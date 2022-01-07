/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {skipSuiteOnJasmine} from '@elric/test-utils';
import runelric from '../runelric';

skipSuiteOnJasmine();
test('`done()` works properly in hooks', () => {
  const {exitCode} = runelric('done-in-hooks');
  expect(exitCode).toEqual(0);
});
