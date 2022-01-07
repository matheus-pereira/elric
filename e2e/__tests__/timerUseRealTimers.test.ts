/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('useRealTimers cancels "timers": "fake" for whole test file', () => {
  const result = runelric('timer-use-real-timers');
  expect(result.stdout).toMatch('API is not mocked with fake timers.');
  expect(result.exitCode).toBe(0);
});
