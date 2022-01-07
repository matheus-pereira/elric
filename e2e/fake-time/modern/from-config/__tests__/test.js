/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

test('fake timers', () => {
  elric.setSystemTime(0);

  expect(Date.now()).toBe(0);

  elric.setSystemTime(1000);

  expect(Date.now()).toBe(1000);
});
