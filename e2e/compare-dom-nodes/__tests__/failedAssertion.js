/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global document */

test('a failed assertion comparing a DOM node does not crash elric', () => {
  expect(document.body).toBe(null);
});
