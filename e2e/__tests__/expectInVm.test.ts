/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('expect works correctly with RegExps created inside a VM', () => {
  const result = runelric('expect-in-vm');
  expect(result.exitCode).toBe(0);
});
