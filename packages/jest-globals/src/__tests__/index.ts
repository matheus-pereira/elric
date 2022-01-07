/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

test('throw when directly imported', () => {
  expect(() => require('../')).toThrowError(
    'Do not import `@elric/globals` outside of the elric test environment',
  );
});
