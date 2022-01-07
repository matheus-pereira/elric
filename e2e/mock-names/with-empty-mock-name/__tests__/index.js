/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

elric.mock('../');
const importedFn = require('../');
// empty mock name should result in default 'elric.fn()' output
const mockFn = elric.fn(importedFn).mockName('');

test('first test', () => {
  mockFn();
  expect(mockFn).toHaveBeenCalledTimes(1);
});
