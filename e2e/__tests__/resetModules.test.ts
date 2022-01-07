/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('elric.resetModules should not error when _isMockFunction is defined but not boolean', () => {
  const result = runelric('reset-modules');
  expect(result.exitCode).toBe(0);
});
