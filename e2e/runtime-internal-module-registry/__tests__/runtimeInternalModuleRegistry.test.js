/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

elric.mock('fs');

describe('Runtime internal module registry', () => {
  it('behaves correctly when requiring a module that is used by elric internals', () => {
    const fs = require('fs');

    // We require from this crazy path so that we can mimick elric (and it's
    // transitive deps) being installed along side a projects deps (e.g. with an
    // NPM3 flat dep tree)
    const elricUtil = require('../../../packages/elric-util');

    // If FS is mocked correctly, this folder won't actually be created on the
    // filesystem
    elricUtil.createDirectory('./dont-create-this-folder');

    expect(fs.__wasMkdirCalled()).toBe(true);
  });
});
