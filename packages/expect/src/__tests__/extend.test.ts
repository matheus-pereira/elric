/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {alignedAnsiStyleSerializer} from '@elric/test-utils';
import * as matcherUtils from 'elric-matcher-utils';
import elricExpect from '../';
import {equals} from '../jasmineUtils';
import {iterableEquality, subsetEquality} from '../utils';

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

elricExpect.extend({
  toBeDivisibleBy(actual: number, expected: number) {
    const pass = actual % expected === 0;
    const message = pass
      ? () =>
          `expected ${this.utils.printReceived(
            actual,
          )} not to be divisible by ${expected}`
      : () =>
          `expected ${this.utils.printReceived(
            actual,
          )} to be divisible by ${expected}`;

    return {message, pass};
  },
  toBeSymbol(actual: symbol, expected: symbol) {
    const pass = actual === expected;
    const message = () =>
      `expected ${actual.toString()} to be Symbol ${expected.toString()}`;

    return {message, pass};
  },
  toBeWithinRange(actual: number, floor: number, ceiling: number) {
    const pass = actual >= floor && actual <= ceiling;
    const message = pass
      ? () =>
          `expected ${this.utils.printReceived(
            actual,
          )} not to be within range ${floor} - ${ceiling}`
      : () =>
          `expected ${this.utils.printReceived(
            actual,
          )} to be within range ${floor} - ${ceiling}`;

    return {message, pass};
  },
});

it('is available globally when matcher is unary', () => {
  elricExpect(15).toBeDivisibleBy(5);
  elricExpect(15).toBeDivisibleBy(3);
  elricExpect(15).not.toBeDivisibleBy(6);

  elricExpect(() =>
    elricExpect(15).toBeDivisibleBy(2),
  ).toThrowErrorMatchingSnapshot();
});

it('is available globally when matcher is variadic', () => {
  elricExpect(15).toBeWithinRange(10, 20);
  elricExpect(15).not.toBeWithinRange(6);

  elricExpect(() =>
    elricExpect(15).toBeWithinRange(1, 3),
  ).toThrowErrorMatchingSnapshot();
});

it('exposes matcherUtils in context', () => {
  elricExpect.extend({
    _shouldNotError(_actual: unknown, _expected: unknown) {
      const pass = this.equals(
        this.utils,
        Object.assign(matcherUtils, {
          iterableEquality,
          subsetEquality,
        }),
      );
      const message = pass
        ? () => `expected this.utils to be defined in an extend call`
        : () => `expected this.utils not to be defined in an extend call`;

      return {message, pass};
    },
  });

  elricExpect()._shouldNotError();
});

it('is ok if there is no message specified', () => {
  elricExpect.extend({
    toFailWithoutMessage(_expected: unknown) {
      return {pass: false};
    },
  });

  expect(() =>
    elricExpect(true).toFailWithoutMessage(),
  ).toThrowErrorMatchingSnapshot();
});

it('exposes an equality function to custom matchers', () => {
  // elricExpect and expect share the same global state
  expect.assertions(3);
  elricExpect.extend({
    toBeOne() {
      expect(this.equals).toBe(equals);
      return {pass: !!this.equals(1, 1)};
    },
  });

  expect(() => elricExpect().toBeOne()).not.toThrow();
});

it('defines asymmetric unary matchers', () => {
  expect(() =>
    elricExpect({value: 2}).toEqual({value: elricExpect.toBeDivisibleBy(2)}),
  ).not.toThrow();
  expect(() =>
    elricExpect({value: 3}).toEqual({value: elricExpect.toBeDivisibleBy(2)}),
  ).toThrowErrorMatchingSnapshot();
});

it('defines asymmetric unary matchers that can be prefixed by not', () => {
  expect(() =>
    elricExpect({value: 2}).toEqual({value: elricExpect.not.toBeDivisibleBy(2)}),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    elricExpect({value: 3}).toEqual({value: elricExpect.not.toBeDivisibleBy(2)}),
  ).not.toThrow();
});

it('defines asymmetric variadic matchers', () => {
  expect(() =>
    elricExpect({value: 2}).toEqual({value: elricExpect.toBeWithinRange(1, 3)}),
  ).not.toThrow();
  expect(() =>
    elricExpect({value: 3}).toEqual({value: elricExpect.toBeWithinRange(4, 11)}),
  ).toThrowErrorMatchingSnapshot();
});

it('defines asymmetric variadic matchers that can be prefixed by not', () => {
  expect(() =>
    elricExpect({value: 2}).toEqual({
      value: elricExpect.not.toBeWithinRange(1, 3),
    }),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    elricExpect({value: 3}).toEqual({
      value: elricExpect.not.toBeWithinRange(5, 7),
    }),
  ).not.toThrow();
});

it('prints the Symbol into the error message', () => {
  const foo = Symbol('foo');
  const bar = Symbol('bar');

  expect(() =>
    elricExpect({a: foo}).toEqual({
      a: elricExpect.toBeSymbol(bar),
    }),
  ).toThrowErrorMatchingSnapshot();
});

it('allows overriding existing extension', () => {
  elricExpect.extend({
    toAllowOverridingExistingMatcher(_expected: unknown) {
      return {pass: _expected === 'bar'};
    },
  });

  elricExpect('foo').not.toAllowOverridingExistingMatcher();

  elricExpect.extend({
    toAllowOverridingExistingMatcher(_expected: unknown) {
      return {pass: _expected === 'foo'};
    },
  });

  elricExpect('foo').toAllowOverridingExistingMatcher();
});
