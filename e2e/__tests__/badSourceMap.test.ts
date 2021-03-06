/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('suite with test cases that contain malformed sourcemaps', () => {
  const result = runelric('bad-source-map');
  expect(result.stderr).not.toMatch('ENOENT');
});
