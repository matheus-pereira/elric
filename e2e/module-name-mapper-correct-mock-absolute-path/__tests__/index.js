/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const importedFn = require('../');

elric.mock('/components/Button');

test('moduleNameMapping correct configuration', () => {
  expect(importedFn).toBeDefined();
});
