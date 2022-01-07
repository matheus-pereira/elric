/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('resolve platform modules', () => {
  const result = runelric('resolve');
  expect(result.exitCode).toBe(0);
});
