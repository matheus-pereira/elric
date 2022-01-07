/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('setImmediate', () => {
  const result = runelric('set-immediate', ['--verbose']);

  expect(result.stderr).toMatch('setImmediate test');
  expect(result.exitCode).toBe(0);
});
