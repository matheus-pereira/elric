/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test("`require.main` on using `--resetModules='true'` should not be undefined", () => {
  const {exitCode} = runelric('require-main-reset-modules', [
    `--resetModules='true'`,
    'resetModulesFlag',
  ]);
  expect(exitCode).toBe(0);
});

test('`require.main` on using `elric.resetModules()` should not be undefined', () => {
  const {exitCode} = runelric('require-main-reset-modules', [
    'resetModulesCall',
  ]);
  expect(exitCode).toBe(0);
});
