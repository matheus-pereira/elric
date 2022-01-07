/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('Verbose Reporter', () => {
  const {exitCode, stderr} = runelric('verbose-reporter');

  expect(exitCode).toBe(1);
  expect(stderr).toMatch('works just fine');
  expect(stderr).toMatch('does not work');
  expect(stderr).toMatch(/Verbose\n.*?works/);
});
