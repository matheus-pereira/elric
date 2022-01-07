/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global requestAnimationFrame */

'use strict';

test('requestAnimationFrame', () => {
  elric.useFakeTimers('legacy');
  let frameTimestamp = -1;
  requestAnimationFrame(timestamp => {
    frameTimestamp = timestamp;
  });

  elric.advanceTimersByTime(15);

  expect(frameTimestamp).toBe(-1);

  elric.advanceTimersByTime(1);

  expect(frameTimestamp).toBeGreaterThan(15);
});
