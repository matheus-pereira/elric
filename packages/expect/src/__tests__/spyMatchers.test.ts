/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Immutable from 'immutable';
import {alignedAnsiStyleSerializer} from '@elric/test-utils';
import elricExpect from '../';

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

// Given a elric mock function, return a minimal mock of a Jasmine spy.
const createSpy = (fn: elric.Mock) => {
  const spy = function () {};

  spy.calls = {
    all() {
      return fn.mock.calls.map(args => ({args}));
    },
    count() {
      return fn.mock.calls.length;
    },
  };

  return spy;
};

['toBeCalled', 'toHaveBeenCalled'].forEach(called => {
  describe(`${called}`, () => {
    test(`works only on spies or elric.fn`, () => {
      const fn = function fn() {};

      expect(() => elricExpect(fn)[called]()).toThrowErrorMatchingSnapshot();
    });

    test(`passes when called`, () => {
      const fn = elric.fn();
      fn('arg0', 'arg1', 'arg2');
      elricExpect(createSpy(fn))[called]();
      elricExpect(fn)[called]();
      expect(() => elricExpect(fn).not[called]()).toThrowErrorMatchingSnapshot();
    });

    test(`.not passes when called`, () => {
      const fn = elric.fn();
      const spy = createSpy(fn);

      elricExpect(spy).not[called]();
      elricExpect(fn).not[called]();
      expect(() => elricExpect(spy)[called]()).toThrowErrorMatchingSnapshot();
    });

    test(`fails with any argument passed`, () => {
      const fn = elric.fn();

      fn();
      expect(() => elricExpect(fn)[called](555)).toThrowErrorMatchingSnapshot();
    });

    test(`.not fails with any argument passed`, () => {
      const fn = elric.fn();

      expect(() =>
        elricExpect(fn).not[called](555),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`includes the custom mock name in the error message`, () => {
      const fn = elric.fn().mockName('named-mock');

      fn();
      elricExpect(fn)[called]();
      expect(() => elricExpect(fn).not[called]()).toThrowErrorMatchingSnapshot();
    });
  });
});

['toBeCalledTimes', 'toHaveBeenCalledTimes'].forEach(calledTimes => {
  describe(`${calledTimes}`, () => {
    test('.not works only on spies or elric.fn', () => {
      const fn = function fn() {};

      expect(() =>
        elricExpect(fn).not[calledTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('only accepts a number argument', () => {
      const fn = elric.fn();
      fn();
      elricExpect(fn)[calledTimes](1);

      [{}, [], true, 'a', new Map(), () => {}].forEach(value => {
        expect(() =>
          elricExpect(fn)[calledTimes](value),
        ).toThrowErrorMatchingSnapshot();
      });
    });

    test('.not only accepts a number argument', () => {
      const fn = elric.fn();
      elricExpect(fn).not[calledTimes](1);

      [{}, [], true, 'a', new Map(), () => {}].forEach(value => {
        expect(() =>
          elricExpect(fn).not[calledTimes](value),
        ).toThrowErrorMatchingSnapshot();
      });
    });

    test('passes if function called equal to expected times', () => {
      const fn = elric.fn();
      fn();
      fn();

      const spy = createSpy(fn);
      elricExpect(spy)[calledTimes](2);
      elricExpect(fn)[calledTimes](2);

      expect(() =>
        elricExpect(spy).not[calledTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('.not passes if function called more than expected times', () => {
      const fn = elric.fn();
      fn();
      fn();
      fn();

      const spy = createSpy(fn);
      elricExpect(spy)[calledTimes](3);
      elricExpect(spy).not[calledTimes](2);

      elricExpect(fn)[calledTimes](3);
      elricExpect(fn).not[calledTimes](2);

      expect(() =>
        elricExpect(fn)[calledTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('.not passes if function called less than expected times', () => {
      const fn = elric.fn();
      fn();

      const spy = createSpy(fn);
      elricExpect(spy)[calledTimes](1);
      elricExpect(spy).not[calledTimes](2);

      elricExpect(fn)[calledTimes](1);
      elricExpect(fn).not[calledTimes](2);

      expect(() =>
        elricExpect(fn)[calledTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('includes the custom mock name in the error message', () => {
      const fn = elric.fn().mockName('named-mock');
      fn();

      expect(() =>
        elricExpect(fn)[calledTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});

[
  'lastCalledWith',
  'toHaveBeenLastCalledWith',
  'nthCalledWith',
  'toHaveBeenNthCalledWith',
  'toBeCalledWith',
  'toHaveBeenCalledWith',
].forEach(calledWith => {
  const caller = function (
    callee: (...a: Array<unknown>) => void,
    ...args: Array<unknown>
  ) {
    if (
      calledWith === 'nthCalledWith' ||
      calledWith === 'toHaveBeenNthCalledWith'
    ) {
      callee(1, ...args);
    } else {
      callee(...args);
    }
  };
  describe(`${calledWith}`, () => {
    test(`works only on spies or elric.fn`, () => {
      const fn = function fn() {};

      expect(() => elricExpect(fn)[calledWith]()).toThrowErrorMatchingSnapshot();
    });

    test(`works when not called`, () => {
      const fn = elric.fn();
      caller(elricExpect(createSpy(fn)).not[calledWith], 'foo', 'bar');
      caller(elricExpect(fn).not[calledWith], 'foo', 'bar');

      expect(() =>
        caller(elricExpect(fn)[calledWith], 'foo', 'bar'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with no arguments`, () => {
      const fn = elric.fn();
      fn();
      caller(elricExpect(createSpy(fn))[calledWith]);
      caller(elricExpect(fn)[calledWith]);
    });

    test(`works with arguments that don't match`, () => {
      const fn = elric.fn();
      fn('foo', 'bar1');

      caller(elricExpect(createSpy(fn)).not[calledWith], 'foo', 'bar');
      caller(elricExpect(fn).not[calledWith], 'foo', 'bar');

      expect(() =>
        caller(elricExpect(fn)[calledWith], 'foo', 'bar'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with arguments that match`, () => {
      const fn = elric.fn();
      fn('foo', 'bar');

      caller(elricExpect(createSpy(fn))[calledWith], 'foo', 'bar');
      caller(elricExpect(fn)[calledWith], 'foo', 'bar');

      expect(() =>
        caller(elricExpect(fn).not[calledWith], 'foo', 'bar'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with trailing undefined arguments`, () => {
      const fn = elric.fn();
      fn('foo', undefined);

      expect(() =>
        caller(elricExpect(fn)[calledWith], 'foo'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Map`, () => {
      const fn = elric.fn();

      const m1 = new Map([
        [1, 2],
        [2, 1],
      ]);
      const m2 = new Map([
        [1, 2],
        [2, 1],
      ]);
      const m3 = new Map([
        ['a', 'b'],
        ['b', 'a'],
      ]);

      fn(m1);

      caller(elricExpect(fn)[calledWith], m2);
      caller(elricExpect(fn).not[calledWith], m3);

      expect(() =>
        caller(elricExpect(fn).not[calledWith], m2),
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        caller(elricExpect(fn)[calledWith], m3),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Set`, () => {
      const fn = elric.fn();

      const s1 = new Set([1, 2]);
      const s2 = new Set([1, 2]);
      const s3 = new Set([3, 4]);

      fn(s1);

      caller(elricExpect(fn)[calledWith], s2);
      caller(elricExpect(fn).not[calledWith], s3);

      expect(() =>
        caller(elricExpect(fn).not[calledWith], s2),
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        caller(elricExpect(fn)[calledWith], s3),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Immutable.js objects`, () => {
      const fn = elric.fn();
      const directlyCreated = Immutable.Map([['a', {b: 'c'}]]);
      const indirectlyCreated = Immutable.Map().set('a', {b: 'c'});
      fn(directlyCreated, indirectlyCreated);

      caller(elricExpect(fn)[calledWith], indirectlyCreated, directlyCreated);

      expect(() =>
        caller(
          elricExpect(fn).not[calledWith],
          indirectlyCreated,
          directlyCreated,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    const basicCalledWith = [
      'lastCalledWith',
      'toHaveBeenLastCalledWith',
      'toBeCalledWith',
      'toHaveBeenCalledWith',
    ];

    if (basicCalledWith.indexOf(calledWith) >= 0) {
      test(`works with many arguments`, () => {
        const fn = elric.fn();
        fn('foo1', 'bar');
        fn('foo', 'bar1');
        fn('foo', 'bar');

        elricExpect(fn)[calledWith]('foo', 'bar');

        expect(() =>
          elricExpect(fn).not[calledWith]('foo', 'bar'),
        ).toThrowErrorMatchingSnapshot();
      });

      test(`works with many arguments that don't match`, () => {
        const fn = elric.fn();
        fn('foo', 'bar1');
        fn('foo', 'bar2');
        fn('foo', 'bar3');

        elricExpect(fn).not[calledWith]('foo', 'bar');

        expect(() =>
          elricExpect(fn)[calledWith]('foo', 'bar'),
        ).toThrowErrorMatchingSnapshot();
      });
    }

    const nthCalled = ['toHaveBeenNthCalledWith', 'nthCalledWith'];
    if (nthCalled.indexOf(calledWith) >= 0) {
      test(`works with three calls`, () => {
        const fn = elric.fn();
        fn('foo1', 'bar');
        fn('foo', 'bar1');
        fn('foo', 'bar');

        elricExpect(fn)[calledWith](1, 'foo1', 'bar');
        elricExpect(fn)[calledWith](2, 'foo', 'bar1');
        elricExpect(fn)[calledWith](3, 'foo', 'bar');

        expect(() => {
          elricExpect(fn).not[calledWith](1, 'foo1', 'bar');
        }).toThrowErrorMatchingSnapshot();
      });

      test('positive throw matcher error for n that is not positive integer', async () => {
        const fn = elric.fn();
        fn('foo1', 'bar');

        expect(() => {
          elricExpect(fn)[calledWith](0, 'foo1', 'bar');
        }).toThrowErrorMatchingSnapshot();
      });

      test('positive throw matcher error for n that is not integer', async () => {
        const fn = elric.fn();
        fn('foo1', 'bar');

        expect(() => {
          elricExpect(fn)[calledWith](0.1, 'foo1', 'bar');
        }).toThrowErrorMatchingSnapshot();
      });

      test('negative throw matcher error for n that is not integer', async () => {
        const fn = elric.fn();
        fn('foo1', 'bar');

        expect(() => {
          elricExpect(fn).not[calledWith](Infinity, 'foo1', 'bar');
        }).toThrowErrorMatchingSnapshot();
      });
    }

    test(`includes the custom mock name in the error message`, () => {
      const fn = elric.fn().mockName('named-mock');
      fn('foo', 'bar');

      caller(elricExpect(fn)[calledWith], 'foo', 'bar');

      expect(() =>
        caller(elricExpect(fn).not[calledWith], 'foo', 'bar'),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});

['toReturn', 'toHaveReturned'].forEach(returned => {
  describe(`${returned}`, () => {
    test(`.not works only on elric.fn`, () => {
      const fn = function fn() {};

      expect(() =>
        elricExpect(fn).not[returned](),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`throw matcher error if received is spy`, () => {
      const spy = createSpy(elric.fn());

      expect(() => elricExpect(spy)[returned]()).toThrowErrorMatchingSnapshot();
    });

    test(`passes when returned`, () => {
      const fn = elric.fn(() => 42);
      fn();
      elricExpect(fn)[returned]();
      expect(() =>
        elricExpect(fn).not[returned](),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`passes when undefined is returned`, () => {
      const fn = elric.fn(() => undefined);
      fn();
      elricExpect(fn)[returned]();
      expect(() =>
        elricExpect(fn).not[returned](),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`passes when at least one call does not throw`, () => {
      const fn = elric.fn(causeError => {
        if (causeError) {
          throw new Error('Error!');
        }

        return 42;
      });

      fn(false);

      try {
        fn(true);
      } catch {
        // ignore error
      }

      fn(false);

      elricExpect(fn)[returned]();
      expect(() =>
        elricExpect(fn).not[returned](),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`.not passes when not returned`, () => {
      const fn = elric.fn();

      elricExpect(fn).not[returned]();
      expect(() => elricExpect(fn)[returned]()).toThrowErrorMatchingSnapshot();
    });

    test(`.not passes when all calls throw`, () => {
      const fn = elric.fn(() => {
        throw new Error('Error!');
      });

      try {
        fn();
      } catch {
        // ignore error
      }

      try {
        fn();
      } catch {
        // ignore error
      }

      elricExpect(fn).not[returned]();
      expect(() => elricExpect(fn)[returned]()).toThrowErrorMatchingSnapshot();
    });

    test(`.not passes when a call throws undefined`, () => {
      const fn = elric.fn(() => {
        // eslint-disable-next-line no-throw-literal
        throw undefined;
      });

      try {
        fn();
      } catch {
        // ignore error
      }

      elricExpect(fn).not[returned]();
      expect(() => elricExpect(fn)[returned]()).toThrowErrorMatchingSnapshot();
    });

    test(`fails with any argument passed`, () => {
      const fn = elric.fn();

      fn();
      expect(() =>
        elricExpect(fn)[returned](555),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`.not fails with any argument passed`, () => {
      const fn = elric.fn();

      expect(() =>
        elricExpect(fn).not[returned](555),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`includes the custom mock name in the error message`, () => {
      const fn = elric.fn(() => 42).mockName('named-mock');
      fn();
      elricExpect(fn)[returned]();
      expect(() =>
        elricExpect(fn).not[returned](),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`incomplete recursive calls are handled properly`, () => {
      // sums up all integers from 0 -> value, using recursion
      const fn: elric.Mock = elric.fn(value => {
        if (value === 0) {
          // Before returning from the base case of recursion, none of the
          // calls have returned yet.
          elricExpect(fn).not[returned]();
          expect(() =>
            elricExpect(fn)[returned](),
          ).toThrowErrorMatchingSnapshot();
          return 0;
        } else {
          return value + fn(value - 1);
        }
      });

      fn(3);
    });
  });
});

['toReturnTimes', 'toHaveReturnedTimes'].forEach(returnedTimes => {
  describe(`${returnedTimes}`, () => {
    test('throw matcher error if received is spy', () => {
      const spy = createSpy(elric.fn());

      expect(() =>
        elricExpect(spy).not[returnedTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('only accepts a number argument', () => {
      const fn = elric.fn(() => 42);
      fn();
      elricExpect(fn)[returnedTimes](1);

      [{}, [], true, 'a', new Map(), () => {}].forEach(value => {
        expect(() =>
          elricExpect(fn)[returnedTimes](value),
        ).toThrowErrorMatchingSnapshot();
      });
    });

    test('.not only accepts a number argument', () => {
      const fn = elric.fn(() => 42);
      elricExpect(fn).not[returnedTimes](2);

      [{}, [], true, 'a', new Map(), () => {}].forEach(value => {
        expect(() =>
          elricExpect(fn).not[returnedTimes](value),
        ).toThrowErrorMatchingSnapshot();
      });
    });

    test('passes if function returned equal to expected times', () => {
      const fn = elric.fn(() => 42);
      fn();
      fn();

      elricExpect(fn)[returnedTimes](2);

      expect(() =>
        elricExpect(fn).not[returnedTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('calls that return undefined are counted as returns', () => {
      const fn = elric.fn(() => undefined);
      fn();
      fn();

      elricExpect(fn)[returnedTimes](2);

      expect(() =>
        elricExpect(fn).not[returnedTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('.not passes if function returned more than expected times', () => {
      const fn = elric.fn(() => 42);
      fn();
      fn();
      fn();

      elricExpect(fn)[returnedTimes](3);
      elricExpect(fn).not[returnedTimes](2);

      expect(() =>
        elricExpect(fn)[returnedTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('.not passes if function called less than expected times', () => {
      const fn = elric.fn(() => 42);
      fn();

      elricExpect(fn)[returnedTimes](1);
      elricExpect(fn).not[returnedTimes](2);

      expect(() =>
        elricExpect(fn)[returnedTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('calls that throw are not counted', () => {
      const fn = elric.fn(causeError => {
        if (causeError) {
          throw new Error('Error!');
        }

        return 42;
      });

      fn(false);

      try {
        fn(true);
      } catch {
        // ignore error
      }

      fn(false);

      elricExpect(fn).not[returnedTimes](3);

      expect(() =>
        elricExpect(fn)[returnedTimes](3),
      ).toThrowErrorMatchingSnapshot();
    });

    test('calls that throw undefined are not counted', () => {
      const fn = elric.fn(causeError => {
        if (causeError) {
          // eslint-disable-next-line no-throw-literal
          throw undefined;
        }

        return 42;
      });

      fn(false);

      try {
        fn(true);
      } catch {
        // ignore error
      }

      fn(false);

      elricExpect(fn)[returnedTimes](2);

      expect(() =>
        elricExpect(fn).not[returnedTimes](2),
      ).toThrowErrorMatchingSnapshot();
    });

    test('includes the custom mock name in the error message', () => {
      const fn = elric.fn(() => 42).mockName('named-mock');
      fn();
      fn();

      elricExpect(fn)[returnedTimes](2);

      expect(() =>
        elricExpect(fn)[returnedTimes](1),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`incomplete recursive calls are handled properly`, () => {
      // sums up all integers from 0 -> value, using recursion
      const fn: elric.Mock = elric.fn(value => {
        if (value === 0) {
          return 0;
        } else {
          const recursiveResult = fn(value - 1);

          if (value === 2) {
            // Only 2 of the recursive calls have returned at this point
            elricExpect(fn)[returnedTimes](2);
            expect(() =>
              elricExpect(fn).not[returnedTimes](2),
            ).toThrowErrorMatchingSnapshot();
          }

          return value + recursiveResult;
        }
      });

      fn(3);
    });
  });
});

[
  'lastReturnedWith',
  'toHaveLastReturnedWith',
  'nthReturnedWith',
  'toHaveNthReturnedWith',
  'toReturnWith',
  'toHaveReturnedWith',
].forEach(returnedWith => {
  const caller = function (
    callee: (...a: Array<unknown>) => void,
    ...args: Array<unknown>
  ) {
    if (
      returnedWith === 'nthReturnedWith' ||
      returnedWith === 'toHaveNthReturnedWith'
    ) {
      callee(1, ...args);
    } else {
      callee(...args);
    }
  };

  describe(`${returnedWith}`, () => {
    test(`works only on spies or elric.fn`, () => {
      const fn = function fn() {};

      expect(() =>
        elricExpect(fn)[returnedWith](),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works when not called`, () => {
      const fn = elric.fn();
      caller(elricExpect(fn).not[returnedWith], 'foo');

      expect(() =>
        caller(elricExpect(fn)[returnedWith], 'foo'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with no arguments`, () => {
      const fn = elric.fn();
      fn();
      caller(elricExpect(fn)[returnedWith]);
    });

    test('works with argument that does not match', () => {
      const fn = elric.fn(() => 'foo');
      fn();

      caller(elricExpect(fn).not[returnedWith], 'bar');

      expect(() =>
        caller(elricExpect(fn)[returnedWith], 'bar'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with argument that does match`, () => {
      const fn = elric.fn(() => 'foo');
      fn();

      caller(elricExpect(fn)[returnedWith], 'foo');

      expect(() =>
        caller(elricExpect(fn).not[returnedWith], 'foo'),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with undefined`, () => {
      const fn = elric.fn(() => undefined);
      fn();

      caller(elricExpect(fn)[returnedWith], undefined);

      expect(() =>
        caller(elricExpect(fn).not[returnedWith], undefined),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Map`, () => {
      const m1 = new Map([
        [1, 2],
        [2, 1],
      ]);
      const m2 = new Map([
        [1, 2],
        [2, 1],
      ]);
      const m3 = new Map([
        ['a', 'b'],
        ['b', 'a'],
      ]);

      const fn = elric.fn(() => m1);
      fn();

      caller(elricExpect(fn)[returnedWith], m2);
      caller(elricExpect(fn).not[returnedWith], m3);

      expect(() =>
        caller(elricExpect(fn).not[returnedWith], m2),
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        caller(elricExpect(fn)[returnedWith], m3),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Set`, () => {
      const s1 = new Set([1, 2]);
      const s2 = new Set([1, 2]);
      const s3 = new Set([3, 4]);

      const fn = elric.fn(() => s1);
      fn();

      caller(elricExpect(fn)[returnedWith], s2);
      caller(elricExpect(fn).not[returnedWith], s3);

      expect(() =>
        caller(elricExpect(fn).not[returnedWith], s2),
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        caller(elricExpect(fn)[returnedWith], s3),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Immutable.js objects directly created`, () => {
      const directlyCreated = Immutable.Map([['a', {b: 'c'}]]);
      const fn = elric.fn(() => directlyCreated);
      fn();

      caller(elricExpect(fn)[returnedWith], directlyCreated);

      expect(() =>
        caller(elricExpect(fn).not[returnedWith], directlyCreated),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`works with Immutable.js objects indirectly created`, () => {
      const indirectlyCreated = Immutable.Map().set('a', {b: 'c'});
      const fn = elric.fn(() => indirectlyCreated);
      fn();

      caller(elricExpect(fn)[returnedWith], indirectlyCreated);

      expect(() =>
        caller(elricExpect(fn).not[returnedWith], indirectlyCreated),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`a call that throws is not considered to have returned`, () => {
      const fn = elric.fn(() => {
        throw new Error('Error!');
      });

      try {
        fn();
      } catch {
        // ignore error
      }

      // It doesn't matter what return value is tested if the call threw
      caller(elricExpect(fn).not[returnedWith], 'foo');
      caller(elricExpect(fn).not[returnedWith], null);
      caller(elricExpect(fn).not[returnedWith], undefined);

      expect(() =>
        caller(elricExpect(fn)[returnedWith], undefined),
      ).toThrowErrorMatchingSnapshot();
    });

    test(`a call that throws undefined is not considered to have returned`, () => {
      const fn = elric.fn(() => {
        // eslint-disable-next-line no-throw-literal
        throw undefined;
      });

      try {
        fn();
      } catch {
        // ignore error
      }

      // It doesn't matter what return value is tested if the call threw
      caller(elricExpect(fn).not[returnedWith], 'foo');
      caller(elricExpect(fn).not[returnedWith], null);
      caller(elricExpect(fn).not[returnedWith], undefined);

      expect(() =>
        caller(elricExpect(fn)[returnedWith], undefined),
      ).toThrowErrorMatchingSnapshot();
    });

    const basicReturnedWith = ['toHaveReturnedWith', 'toReturnWith'];
    if (basicReturnedWith.indexOf(returnedWith) >= 0) {
      describe('returnedWith', () => {
        test(`works with more calls than the limit`, () => {
          const fn = elric.fn();
          fn.mockReturnValueOnce('foo1');
          fn.mockReturnValueOnce('foo2');
          fn.mockReturnValueOnce('foo3');
          fn.mockReturnValueOnce('foo4');
          fn.mockReturnValueOnce('foo5');
          fn.mockReturnValueOnce('foo6');

          fn();
          fn();
          fn();
          fn();
          fn();
          fn();

          elricExpect(fn).not[returnedWith]('bar');

          expect(() => {
            elricExpect(fn)[returnedWith]('bar');
          }).toThrowErrorMatchingSnapshot();
        });

        test(`incomplete recursive calls are handled properly`, () => {
          // sums up all integers from 0 -> value, using recursion
          const fn: elric.Mock = elric.fn(value => {
            if (value === 0) {
              // Before returning from the base case of recursion, none of the
              // calls have returned yet.
              // This test ensures that the incomplete calls are not incorrectly
              // interpretted as have returned undefined
              elricExpect(fn).not[returnedWith](undefined);
              expect(() =>
                elricExpect(fn)[returnedWith](undefined),
              ).toThrowErrorMatchingSnapshot();

              return 0;
            } else {
              return value + fn(value - 1);
            }
          });

          fn(3);
        });
      });
    }

    const nthReturnedWith = ['toHaveNthReturnedWith', 'nthReturnedWith'];
    if (nthReturnedWith.indexOf(returnedWith) >= 0) {
      describe('nthReturnedWith', () => {
        test(`works with three calls`, () => {
          const fn = elric.fn();
          fn.mockReturnValueOnce('foo1');
          fn.mockReturnValueOnce('foo2');
          fn.mockReturnValueOnce('foo3');
          fn();
          fn();
          fn();

          elricExpect(fn)[returnedWith](1, 'foo1');
          elricExpect(fn)[returnedWith](2, 'foo2');
          elricExpect(fn)[returnedWith](3, 'foo3');

          expect(() => {
            elricExpect(fn).not[returnedWith](1, 'foo1');
            elricExpect(fn).not[returnedWith](2, 'foo2');
            elricExpect(fn).not[returnedWith](3, 'foo3');
          }).toThrowErrorMatchingSnapshot();
        });

        test('should replace 1st, 2nd, 3rd with first, second, third', async () => {
          const fn = elric.fn();
          fn.mockReturnValueOnce('foo1');
          fn.mockReturnValueOnce('foo2');
          fn.mockReturnValueOnce('foo3');
          fn();
          fn();
          fn();

          expect(() => {
            elricExpect(fn)[returnedWith](1, 'bar1');
            elricExpect(fn)[returnedWith](2, 'bar2');
            elricExpect(fn)[returnedWith](3, 'bar3');
          }).toThrowErrorMatchingSnapshot();

          expect(() => {
            elricExpect(fn).not[returnedWith](1, 'foo1');
            elricExpect(fn).not[returnedWith](2, 'foo2');
            elricExpect(fn).not[returnedWith](3, 'foo3');
          }).toThrowErrorMatchingSnapshot();
        });

        test('positive throw matcher error for n that is not positive integer', async () => {
          const fn = elric.fn(() => 'foo');
          fn();

          expect(() => {
            elricExpect(fn)[returnedWith](0, 'foo');
          }).toThrowErrorMatchingSnapshot();
        });

        test('should reject nth value greater than number of calls', async () => {
          const fn = elric.fn(() => 'foo');
          fn();
          fn();
          fn();

          expect(() => {
            elricExpect(fn)[returnedWith](4, 'foo');
          }).toThrowErrorMatchingSnapshot();
        });

        test('positive throw matcher error for n that is not integer', async () => {
          const fn: elric.Mock = elric.fn(() => 'foo');
          fn('foo');

          expect(() => {
            elricExpect(fn)[returnedWith](0.1, 'foo');
          }).toThrowErrorMatchingSnapshot();
        });

        test('negative throw matcher error for n that is not number', async () => {
          const fn: elric.Mock = elric.fn(() => 'foo');
          fn('foo');

          expect(() => {
            elricExpect(fn).not[returnedWith]();
          }).toThrowErrorMatchingSnapshot();
        });

        test(`incomplete recursive calls are handled properly`, () => {
          // sums up all integers from 0 -> value, using recursion
          const fn: elric.Mock = elric.fn(value => {
            if (value === 0) {
              return 0;
            } else {
              const recursiveResult = fn(value - 1);

              if (value === 2) {
                // Only 2 of the recursive calls have returned at this point
                elricExpect(fn).not[returnedWith](1, 6);
                elricExpect(fn).not[returnedWith](2, 3);
                elricExpect(fn)[returnedWith](3, 1);
                elricExpect(fn)[returnedWith](4, 0);

                expect(() =>
                  elricExpect(fn)[returnedWith](1, 6),
                ).toThrowErrorMatchingSnapshot();
                expect(() =>
                  elricExpect(fn)[returnedWith](2, 3),
                ).toThrowErrorMatchingSnapshot();
                expect(() =>
                  elricExpect(fn).not[returnedWith](3, 1),
                ).toThrowErrorMatchingSnapshot();
                expect(() =>
                  elricExpect(fn).not[returnedWith](4, 0),
                ).toThrowErrorMatchingSnapshot();
              }

              return value + recursiveResult;
            }
          });

          fn(3);
        });
      });
    }

    const lastReturnedWith = ['toHaveLastReturnedWith', 'lastReturnedWith'];
    if (lastReturnedWith.indexOf(returnedWith) >= 0) {
      describe('lastReturnedWith', () => {
        test(`works with three calls`, () => {
          const fn = elric.fn();
          fn.mockReturnValueOnce('foo1');
          fn.mockReturnValueOnce('foo2');
          fn.mockReturnValueOnce('foo3');
          fn();
          fn();
          fn();

          elricExpect(fn)[returnedWith]('foo3');

          expect(() => {
            elricExpect(fn).not[returnedWith]('foo3');
          }).toThrowErrorMatchingSnapshot();
        });

        test(`incomplete recursive calls are handled properly`, () => {
          // sums up all integers from 0 -> value, using recursion
          const fn: elric.Mock = elric.fn(value => {
            if (value === 0) {
              // Before returning from the base case of recursion, none of the
              // calls have returned yet.
              elricExpect(fn).not[returnedWith](0);
              expect(() =>
                elricExpect(fn)[returnedWith](0),
              ).toThrowErrorMatchingSnapshot();
              return 0;
            } else {
              return value + fn(value - 1);
            }
          });

          fn(3);
        });
      });
    }

    test(`includes the custom mock name in the error message`, () => {
      const fn = elric.fn().mockName('named-mock');
      caller(elricExpect(fn).not[returnedWith], 'foo');

      expect(() =>
        caller(elricExpect(fn)[returnedWith], 'foo'),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
