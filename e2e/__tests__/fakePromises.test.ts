/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

describe('Fake promises', () => {
  it('should be possible to resolve with fake timers using immediates', () => {
    const result = runelric('fake-promises/immediate');
    expect(result.exitCode).toBe(0);
  });

  it('should be possible to resolve with fake timers using asap', () => {
    const result = runelric('fake-promises/asap');
    expect(result.exitCode).toBe(0);
  });
});
