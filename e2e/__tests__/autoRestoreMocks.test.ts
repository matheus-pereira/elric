/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('suite with auto-restore', () => {
  const result = runelric('auto-restore-mocks/with-auto-restore');
  expect(result.exitCode).toBe(0);
});

test('suite without auto-restore', () => {
  const result = runelric('auto-restore-mocks/without-auto-restore');
  expect(result.exitCode).toBe(0);
});
