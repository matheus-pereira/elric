/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (
  require('elric-runtime/src/__tests__/test_root/RegularModule').getModuleStateValue()
) {
  console.log('Hello, world!');
} else {
  console.log('Automocking is not properly disabled in elric-runtime.');
}
