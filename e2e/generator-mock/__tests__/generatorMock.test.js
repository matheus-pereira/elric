/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

elric.mock('../index');

const methods = require('../index');

test('mock works with generator', () => {
  expect(methods.generatorMethod).toBeDefined();
});
