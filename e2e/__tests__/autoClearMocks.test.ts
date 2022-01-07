/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('suite with auto-clear', () => {
  const result = runelric('auto-clear-mocks/with-auto-clear');
  expect(result.exitCode).toBe(0);
});

test('suite without auto-clear', () => {
  const result = runelric('auto-clear-mocks/without-auto-clear');
  expect(result.exitCode).toBe(0);
});
