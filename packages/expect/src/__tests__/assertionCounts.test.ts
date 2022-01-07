/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {alignedAnsiStyleSerializer} from '@elric/test-utils';
import elricExpect from '../';

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe('.assertions()', () => {
  it('does not throw', () => {
    elricExpect.assertions(2);
    elricExpect('a').not.toBe('b');
    elricExpect('a').toBe('a');
  });

  it('redeclares different assertion count', () => {
    elricExpect.assertions(3);
    elricExpect('a').not.toBe('b');
    elricExpect('a').toBe('a');
    elricExpect.assertions(2);
  });
  it('expects no assertions', () => {
    elricExpect.assertions(0);
  });
});

describe('.hasAssertions()', () => {
  it('does not throw if there is an assertion', () => {
    elricExpect.hasAssertions();
    elricExpect('a').toBe('a');
  });

  it('throws if expected is not undefined', () => {
    elricExpect(() => {
      // @ts-expect-error
      elricExpect.hasAssertions(2);
    }).toThrowErrorMatchingSnapshot();
  });

  it('hasAssertions not leaking to global state', () => {});
});
