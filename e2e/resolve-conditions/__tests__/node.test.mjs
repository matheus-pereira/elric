/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @elric-environment <rootDir>/node-env.js
 */

import {fn} from 'fake-dual-dep';

test('returns correct message', () => {
  expect(fn()).toEqual('hello from node');
});
