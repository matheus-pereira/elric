/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('suite with auto-reset', () => {
  const result = runelric('auto-reset-mocks/with-auto-reset');
  expect(result.exitCode).toBe(0);
});

test('suite without auto-reset', () => {
  const result = runelric('auto-reset-mocks/without-auto-reset');
  expect(result.exitCode).toBe(0);
});
