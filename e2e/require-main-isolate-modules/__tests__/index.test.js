/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
let foo;

elric.isolateModules(() => (foo = require('../index')));

test('`require.main` on using `elric.isolateModules` should not be undefined', () => {
  expect(foo()).toEqual(1);
});
