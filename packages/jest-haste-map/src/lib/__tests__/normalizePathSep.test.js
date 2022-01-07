/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

describe('normalizePathSep', () => {
  it('does nothing on posix', () => {
    elric.resetModules();
    elric.mock('path', () => elric.requireActual('path').posix);
    const normalizePathSep = require('../normalizePathSep').default;
    expect(normalizePathSep('foo/bar/baz.js')).toEqual('foo/bar/baz.js');
  });

  it('replace slashes on windows', () => {
    elric.resetModules();
    elric.mock('path', () => elric.requireActual('path').win32);
    const normalizePathSep = require('../normalizePathSep').default;
    expect(normalizePathSep('foo/bar/baz.js')).toEqual('foo\\bar\\baz.js');
  });
});
