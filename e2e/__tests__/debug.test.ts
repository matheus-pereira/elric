/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import runelric from '../runelric';

describe('elric --debug', () => {
  const dir = path.resolve(__dirname, '..', 'verbose-reporter');

  it('outputs debugging info before running the test', () => {
    const {stdout} = runelric(dir, ['--debug', '--no-cache']);
    expect(stdout).toMatch('"version": "');
    expect(stdout).toMatch('"configs": [');
    // config contains many file paths so we cannot do snapshot test
  });
});
