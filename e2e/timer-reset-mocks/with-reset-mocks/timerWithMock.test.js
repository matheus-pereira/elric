/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('timers', () => {
  it('should work before calling resetAllMocks', () => {
    const f = elric.fn();
    elric.useFakeTimers();
    setTimeout(f, 0);
    elric.runAllTimers();
    expect(f).toHaveBeenCalledTimes(1);
  });
});
