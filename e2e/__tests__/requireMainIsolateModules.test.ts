/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('`require.main` on using `elric.isolateModules` should not be undefined', () => {
  const {exitCode} = runelric('require-main-isolate-modules');

  expect(exitCode).toBe(0);
});
