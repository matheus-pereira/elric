/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('provides `require.main` set to test suite module', () => {
  const {stderr, stdout} = runelric('require-main');
  expect(stdout).not.toMatch('No tests found');
  expect(stderr).toMatch(/PASS __tests__(\/|\\+)loader\.test\.js/);
});
