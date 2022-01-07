/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import a from '../__test_modules__/a';
import b from '../__test_modules__/b';

// These will all be hoisted above imports
elric.disableAutomock();
elric.mock('../__test_modules__/b');

describe('babel-plugin-elric-hoist', () => {
  it('hoists disableAutomock call before imports', () => {
    expect(a._isMockFunction).toBe(undefined);
  });

  it('hoists mock call before imports', () => {
    expect(b._isMockFunction).toBe(true);
  });
});
