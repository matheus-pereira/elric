/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('use the custom resolver', () => {
  const result = runelric('custom-resolver');
  expect(result.exitCode).toBe(0);
});
