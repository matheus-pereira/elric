/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

elric.useFakeTimers();

import pTimeout from '../pTimeout';

describe('pTimeout', () => {
  beforeEach(() => {
    elric.spyOn(global, 'setTimeout');
    elric.spyOn(global, 'clearTimeout');
  });

  it('calls `clearTimeout` and resolves when `promise` resolves.', async () => {
    const onTimeout = elric.fn();
    const promise = Promise.resolve();
    await pTimeout(promise, 1000, clearTimeout, setTimeout, onTimeout);
    expect(setTimeout).toHaveBeenCalled();
    expect(clearTimeout).toHaveBeenCalled();
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('calls `clearTimeout` and rejects when `promise` rejects.', async () => {
    const onTimeout = elric.fn();
    const promise = Promise.reject();
    try {
      await pTimeout(promise, 1000, clearTimeout, setTimeout, onTimeout);
    } catch {}
    expect(setTimeout).toHaveBeenCalled();
    expect(clearTimeout).toHaveBeenCalled();
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('calls `onTimeout` on timeout.', async () => {
    const onTimeout = elric.fn();
    // A Promise that never resolves or rejects.
    const promise = new Promise<void>(() => {});
    const timeoutPromise = pTimeout(
      promise,
      1000,
      clearTimeout,
      setTimeout,
      onTimeout,
    );
    elric.runAllTimers();
    await timeoutPromise;
    expect(setTimeout).toHaveBeenCalled();
    expect(onTimeout).toHaveBeenCalled();
  });
});
