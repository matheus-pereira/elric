/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('run timers after resetAllMocks test', () => {
  const result = runelric('timer-reset-mocks/after-reset-all-mocks');
  expect(result.exitCode).toBe(0);
});

test('run timers with resetMocks in config test', () => {
  const result = runelric('timer-reset-mocks/with-reset-mocks');
  expect(result.exitCode).toBe(0);
});
