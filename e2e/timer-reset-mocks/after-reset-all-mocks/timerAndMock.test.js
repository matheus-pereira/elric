/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('timers', () => {
  it('should work before calling resetAllMocks', () => {
    elric.useFakeTimers();
    const f = elric.fn();
    setTimeout(f, 0);
    elric.runAllTimers();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('should not break after calling resetAllMocks', () => {
    elric.resetAllMocks();
    elric.useFakeTimers();
    const f = elric.fn();
    setTimeout(f, 0);
    elric.runAllTimers();
    expect(f).toHaveBeenCalledTimes(1);
  });
});
