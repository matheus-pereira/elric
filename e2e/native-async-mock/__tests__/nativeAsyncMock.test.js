/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

elric.mock('../Native');

const native = require('../Native');

test('mock works with native async', () => {
  expect(native.asyncMethod).toBeDefined();
});
