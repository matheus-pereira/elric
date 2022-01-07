/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-duplicates */
import {elric} from '@elric/globals';
import {elric as aliasedelric} from '@elric/globals';
import * as elricGlobals from '@elric/globals';
/* eslint-enable import/no-duplicates */
import a from '../__test_modules__/a';
import b from '../__test_modules__/b';
import c from '../__test_modules__/c';
import d from '../__test_modules__/d';

// These will be hoisted above imports

elric.unmock('../__test_modules__/a');
aliasedelric.unmock('../__test_modules__/b');
elricGlobals.elric.unmock('../__test_modules__/c');

// These will not be hoisted above imports

{
  const elric = {unmock: () => {}};
  elric.unmock('../__test_modules__/d');
}

// tests

test('named import', () => {
  expect(a._isMockFunction).toBe(undefined);
  expect(a()).toBe('unmocked');
});

test('aliased named import', () => {
  expect(b._isMockFunction).toBe(undefined);
  expect(b()).toBe('unmocked');
});

test('namespace import', () => {
  expect(c._isMockFunction).toBe(undefined);
  expect(c()).toBe('unmocked');
});

test('fake elric, shadowed import', () => {
  expect(d._isMockFunction).toBe(true);
  expect(d()).toBe(undefined);
});
