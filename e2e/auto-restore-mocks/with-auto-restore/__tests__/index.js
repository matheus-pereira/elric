/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const TestClass = require('../');
const localClass = new TestClass();

test('first test', () => {
  elric.spyOn(localClass, 'test').mockImplementation(() => 'ABCD');
  expect(localClass.test()).toEqual('ABCD');
  expect(localClass.test).toHaveBeenCalledTimes(1);
});

test('second test', () => {
  expect(localClass.test()).toEqual('12345');
  expect(localClass.test.mock).toBe(undefined);
});
