/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  expect as importedExpect,
  elric as importedelric,
  test as importedTest,
} from '@elric/globals';

importedTest('they match the globals', () => {
  importedExpect(importedExpect).toBe(expect);
  importedExpect(importedelric).toBe(elric);
  importedExpect(importedTest).toBe(test);

  expect(importedExpect).toBe(expect);
  expect(importedelric).toBe(elric);
  expect(importedTest).toBe(test);
});
