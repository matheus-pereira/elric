/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
/*eslint-env browser */

test('found url elricjs.io', () => {
  expect(window.location.href).toBe('https://elricjs.io/');
});
