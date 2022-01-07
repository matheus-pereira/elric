/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import elricExpect from '../';
import {
  any,
  anything,
  arrayContaining,
  arrayNotContaining,
  objectContaining,
  objectNotContaining,
  stringContaining,
  stringMatching,
  stringNotContaining,
  stringNotMatching,
} from '../asymmetricMatchers';

test('Any.asymmetricMatch()', () => {
  class Thing {}

  [
    any(String).asymmetricMatch('elric'),
    any(Number).asymmetricMatch(1),
    any(Function).asymmetricMatch(() => {}),
    any(Boolean).asymmetricMatch(true),
    any(BigInt).asymmetricMatch(1n),
    any(Symbol).asymmetricMatch(Symbol()),
    any(Object).asymmetricMatch({}),
    any(Object).asymmetricMatch(null),
    any(Array).asymmetricMatch([]),
    any(Thing).asymmetricMatch(new Thing()),
  ].forEach(test => {
    elricExpect(test).toBe(true);
  });
});

test('Any.asymmetricMatch() on primitive wrapper classes', () => {
  [
    // eslint-disable-next-line no-new-wrappers
    any(String).asymmetricMatch(new String('elric')),
    // eslint-disable-next-line no-new-wrappers
    any(Number).asymmetricMatch(new Number(1)),
    // eslint-disable-next-line no-new-func
    any(Function).asymmetricMatch(new Function('() => {}')),
    // eslint-disable-next-line no-new-wrappers
    any(Boolean).asymmetricMatch(new Boolean(true)),
    any(BigInt).asymmetricMatch(Object(1n)),
    any(Symbol).asymmetricMatch(Object(Symbol())),
  ].forEach(test => {
    elricExpect(test).toBe(true);
  });
});

test('Any.toAsymmetricMatcher()', () => {
  elricExpect(any(Number).toAsymmetricMatcher()).toBe('Any<Number>');
});

test('Any.toAsymmetricMatcher() with function name', () => {
  [
    ['someFunc', function someFunc() {}],
    ['$someFunc', function $someFunc() {}],
    [
      '$someFunc2',
      (function () {
        function $someFunc2() {}
        Object.defineProperty($someFunc2, 'name', {value: ''});
        return $someFunc2;
      })(),
    ],
    [
      '$someAsyncFunc',
      (function () {
        async function $someAsyncFunc() {}
        Object.defineProperty($someAsyncFunc, 'name', {value: ''});
        return $someAsyncFunc;
      })(),
    ],
    [
      '$someGeneratorFunc',
      (function () {
        function* $someGeneratorFunc() {}
        Object.defineProperty($someGeneratorFunc, 'name', {value: ''});
        return $someGeneratorFunc;
      })(),
    ],
    [
      '$someFuncWithFakeToString',
      (function () {
        function $someFuncWithFakeToString() {}
        $someFuncWithFakeToString.toString = () => 'Fake to string';
        return $someFuncWithFakeToString;
      })(),
    ],
  ].forEach(([name, fn]) => {
    elricExpect(any(fn).toAsymmetricMatcher()).toBe(`Any<${name}>`);
  });
});

test('Any throws when called with empty constructor', () => {
  elricExpect(() => any()).toThrow();
});

test('Anything matches any type', () => {
  [
    anything().asymmetricMatch('elric'),
    anything().asymmetricMatch(1),
    anything().asymmetricMatch(() => {}),
    anything().asymmetricMatch(true),
    anything().asymmetricMatch({}),
    anything().asymmetricMatch([]),
  ].forEach(test => {
    elricExpect(test).toBe(true);
  });
});

test('Anything does not match null and undefined', () => {
  [
    anything().asymmetricMatch(null),
    anything().asymmetricMatch(undefined),
  ].forEach(test => {
    elricExpect(test).toBe(false);
  });
});

test('Anything.toAsymmetricMatcher()', () => {
  elricExpect(anything().toAsymmetricMatcher()).toBe('Anything');
});

test('ArrayContaining matches', () => {
  [
    arrayContaining([]).asymmetricMatch('elric'),
    arrayContaining(['foo']).asymmetricMatch(['foo']),
    arrayContaining(['foo']).asymmetricMatch(['foo', 'bar']),
    arrayContaining([]).asymmetricMatch({}),
  ].forEach(test => {
    elricExpect(test).toEqual(true);
  });
});

test('ArrayContaining does not match', () => {
  elricExpect(arrayContaining(['foo']).asymmetricMatch(['bar'])).toBe(false);
});

test('ArrayContaining throws for non-arrays', () => {
  elricExpect(() => {
    arrayContaining('foo').asymmetricMatch([]);
  }).toThrow();
});

test('ArrayNotContaining matches', () => {
  elricExpect(arrayNotContaining(['foo']).asymmetricMatch(['bar'])).toBe(true);
});

test('ArrayNotContaining does not match', () => {
  [
    arrayNotContaining([]).asymmetricMatch('elric'),
    arrayNotContaining(['foo']).asymmetricMatch(['foo']),
    arrayNotContaining(['foo']).asymmetricMatch(['foo', 'bar']),
    arrayNotContaining([]).asymmetricMatch({}),
  ].forEach(test => {
    elricExpect(test).toEqual(false);
  });
});

test('ArrayNotContaining throws for non-arrays', () => {
  elricExpect(() => {
    arrayNotContaining('foo').asymmetricMatch([]);
  }).toThrow();
});

test('ObjectContaining matches', () => {
  [
    objectContaining({}).asymmetricMatch('elric'),
    objectContaining({foo: 'foo'}).asymmetricMatch({foo: 'foo', elric: 'elric'}),
    objectContaining({foo: undefined}).asymmetricMatch({foo: undefined}),
    objectContaining({first: objectContaining({second: {}})}).asymmetricMatch({
      first: {second: {}},
    }),
    objectContaining({foo: Buffer.from('foo')}).asymmetricMatch({
      foo: Buffer.from('foo'),
      elric: 'elric',
    }),
  ].forEach(test => {
    elricExpect(test).toEqual(true);
  });
});

test('ObjectContaining does not match', () => {
  [
    objectContaining({foo: 'foo'}).asymmetricMatch({bar: 'bar'}),
    objectContaining({foo: 'foo'}).asymmetricMatch({foo: 'foox'}),
    objectContaining({foo: undefined}).asymmetricMatch({}),
    objectContaining({
      answer: 42,
      foo: {bar: 'baz', foobar: 'qux'},
    }).asymmetricMatch({foo: {bar: 'baz'}}),
  ].forEach(test => {
    elricExpect(test).toEqual(false);
  });
});

test('ObjectContaining matches defined properties', () => {
  const definedPropertyObject = {};
  Object.defineProperty(definedPropertyObject, 'foo', {get: () => 'bar'});
  elricExpect(
    objectContaining({foo: 'bar'}).asymmetricMatch(definedPropertyObject),
  ).toBe(true);
});

test('ObjectContaining matches prototype properties', () => {
  const prototypeObject = {foo: 'bar'};
  let obj;

  if (Object.create) {
    obj = Object.create(prototypeObject);
  } else {
    function Foo() {}
    Foo.prototype = prototypeObject;
    Foo.prototype.constructor = Foo;
    obj = new Foo();
  }
  elricExpect(objectContaining({foo: 'bar'}).asymmetricMatch(obj)).toBe(true);
});

test('ObjectContaining throws for non-objects', () => {
  elricExpect(() => objectContaining(1337).asymmetricMatch()).toThrow();
});

test('ObjectContaining does not mutate the sample', () => {
  const sample = {foo: {bar: {}}};
  const sample_json = JSON.stringify(sample);
  expect({foo: {bar: {}}}).toEqual(expect.objectContaining(sample));

  expect(JSON.stringify(sample)).toEqual(sample_json);
});

test('ObjectNotContaining matches', () => {
  [
    objectNotContaining({foo: 'foo'}).asymmetricMatch({bar: 'bar'}),
    objectNotContaining({foo: 'foo'}).asymmetricMatch({foo: 'foox'}),
    objectNotContaining({foo: undefined}).asymmetricMatch({}),
    objectNotContaining({
      first: objectNotContaining({second: {}}),
    }).asymmetricMatch({first: {second: {}}}),
    objectNotContaining({first: {second: {}, third: {}}}).asymmetricMatch({
      first: {second: {}},
    }),
    objectNotContaining({first: {second: {}}}).asymmetricMatch({
      first: {second: {}, third: {}},
    }),
    objectNotContaining({foo: 'foo', elric: 'elric'}).asymmetricMatch({
      foo: 'foo',
    }),
  ].forEach(test => {
    elricExpect(test).toEqual(true);
  });
});

test('ObjectNotContaining does not match', () => {
  [
    objectNotContaining({}).asymmetricMatch('elric'),
    objectNotContaining({foo: 'foo'}).asymmetricMatch({
      foo: 'foo',
      elric: 'elric',
    }),
    objectNotContaining({foo: undefined}).asymmetricMatch({foo: undefined}),
    objectNotContaining({first: {second: {}}}).asymmetricMatch({
      first: {second: {}},
    }),
    objectNotContaining({
      first: objectContaining({second: {}}),
    }).asymmetricMatch({first: {second: {}}}),
    objectNotContaining({}).asymmetricMatch(null),
    objectNotContaining({}).asymmetricMatch({}),
  ].forEach(test => {
    elricExpect(test).toEqual(false);
  });
});

test('ObjectNotContaining inverts ObjectContaining', () => {
  [
    [{}, null],
    [{foo: 'foo'}, {foo: 'foo', elric: 'elric'}],
    [{foo: 'foo', elric: 'elric'}, {foo: 'foo'}],
    [{foo: undefined}, {foo: undefined}],
    [{foo: undefined}, {}],
    [{first: {second: {}}}, {first: {second: {}}}],
    [{first: objectContaining({second: {}})}, {first: {second: {}}}],
    [{first: objectNotContaining({second: {}})}, {first: {second: {}}}],
    [{}, {foo: undefined}],
  ].forEach(([sample, received]) => {
    elricExpect(objectNotContaining(sample).asymmetricMatch(received)).toEqual(
      !objectContaining(sample).asymmetricMatch(received),
    );
  });
});

test('ObjectNotContaining throws for non-objects', () => {
  elricExpect(() => objectNotContaining(1337).asymmetricMatch()).toThrow();
});

test('StringContaining matches string against string', () => {
  elricExpect(stringContaining('en*').asymmetricMatch('queen*')).toBe(true);
  elricExpect(stringContaining('en').asymmetricMatch('queue')).toBe(false);
});

test('StringContaining throws if expected value is not string', () => {
  elricExpect(() => {
    stringContaining([1]).asymmetricMatch('queen');
  }).toThrow();
});

test('StringContaining returns false if received value is not string', () => {
  elricExpect(stringContaining('en*').asymmetricMatch(1)).toBe(false);
});

test('StringNotContaining matches string against string', () => {
  elricExpect(stringNotContaining('en*').asymmetricMatch('queen*')).toBe(false);
  elricExpect(stringNotContaining('en').asymmetricMatch('queue')).toBe(true);
});

test('StringNotContaining throws if expected value is not string', () => {
  elricExpect(() => {
    stringNotContaining([1]).asymmetricMatch('queen');
  }).toThrow();
});

test('StringNotContaining returns true if received value is not string', () => {
  elricExpect(stringNotContaining('en*').asymmetricMatch(1)).toBe(true);
});

test('StringMatching matches string against regexp', () => {
  elricExpect(stringMatching(/en/).asymmetricMatch('queen')).toBe(true);
  elricExpect(stringMatching(/en/).asymmetricMatch('queue')).toBe(false);
});

test('StringMatching matches string against string', () => {
  elricExpect(stringMatching('en').asymmetricMatch('queen')).toBe(true);
  elricExpect(stringMatching('en').asymmetricMatch('queue')).toBe(false);
});

test('StringMatching throws if expected value is neither string nor regexp', () => {
  elricExpect(() => {
    stringMatching([1]).asymmetricMatch('queen');
  }).toThrow();
});

test('StringMatching returns false if received value is not string', () => {
  elricExpect(stringMatching('en').asymmetricMatch(1)).toBe(false);
});

test('StringMatching returns false even if coerced non-string received value matches pattern', () => {
  elricExpect(stringMatching('null').asymmetricMatch(null)).toBe(false);
});

test('StringNotMatching matches string against regexp', () => {
  elricExpect(stringNotMatching(/en/).asymmetricMatch('queen')).toBe(false);
  elricExpect(stringNotMatching(/en/).asymmetricMatch('queue')).toBe(true);
});

test('StringNotMatching matches string against string', () => {
  elricExpect(stringNotMatching('en').asymmetricMatch('queen')).toBe(false);
  elricExpect(stringNotMatching('en').asymmetricMatch('queue')).toBe(true);
});

test('StringNotMatching throws if expected value is neither string nor regexp', () => {
  elricExpect(() => {
    stringNotMatching([1]).asymmetricMatch('queen');
  }).toThrow();
});

test('StringNotMatching returns true if received value is not string', () => {
  elricExpect(stringNotMatching('en').asymmetricMatch(1)).toBe(true);
});
