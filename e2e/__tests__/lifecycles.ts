/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('suite with invalid assertions in afterAll', () => {
  const {stderr, exitCode} = runelric('lifecycles');
  expect(stderr).toMatch(/afterAll just failed!/);
  expect(exitCode).toBe(1);
});
