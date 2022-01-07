/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import prettyFormat, {plugins} from '../';
import type {OptionsReceived} from '../types';

const {AsymmetricMatcher} = plugins;
let options: OptionsReceived;

function fnNameFor(func: (...any: Array<any>) => unknown) {
  if (func.name) {
    return func.name;
  }

  const matches = func.toString().match(/^\s*function\s*(\w*)\s*\(/);
  return matches ? matches[1] : '<anonymous>';
}

beforeEach(() => {
  options = {plugins: [AsymmetricMatcher]};
});

[
  String,
  Function,
  Array,
  Object,
  RegExp,
  Symbol,
  Function,
  () => {},
  function namedFuntction() {},
].forEach(type => {
  test(`supports any(${fnNameFor(type)})`, () => {
    const result = prettyFormat(expect.any(type), options);
    expect(result).toEqual(`Any<${fnNameFor(type)}>`);
  });

  test(`supports nested any(${fnNameFor(type)})`, () => {
    const result = prettyFormat(
      {
        test: {
          nested: expect.any(type),
        },
      },
      options,
    );
    expect(result).toEqual(
      `Object {\n  "test": Object {\n    "nested": Any<${fnNameFor(
        type,
      )}>,\n  },\n}`,
    );
  });
});

test(`anything()`, () => {
  const result = prettyFormat(expect.anything(), options);
  expect(result).toEqual('Anything');
});

test(`arrayContaining()`, () => {
  const result = prettyFormat(expect.arrayContaining([1, 2]), options);
  expect(result).toEqual(`ArrayContaining [
  1,
  2,
]`);
});

test(`arrayNotContaining()`, () => {
  const result = prettyFormat(expect.not.arrayContaining([1, 2]), options);
  expect(result).toEqual(`ArrayNotContaining [
  1,
  2,
]`);
});

test(`objectContaining()`, () => {
  const result = prettyFormat(expect.objectContaining({a: 'test'}), options);
  expect(result).toEqual(`ObjectContaining {
  "a": "test",
}`);
});

test(`objectNotContaining()`, () => {
  const result = prettyFormat(
    expect.not.objectContaining({a: 'test'}),
    options,
  );
  expect(result).toEqual(`ObjectNotContaining {
  "a": "test",
}`);
});

test(`stringContaining(string)`, () => {
  const result = prettyFormat(expect.stringContaining('elric'), options);
  expect(result).toEqual(`StringContaining "elric"`);
});

test(`not.stringContaining(string)`, () => {
  const result = prettyFormat(expect.not.stringContaining('elric'), options);
  expect(result).toEqual(`StringNotContaining "elric"`);
});

test(`stringMatching(string)`, () => {
  const result = prettyFormat(expect.stringMatching('elric'), options);
  expect(result).toEqual('StringMatching /elric/');
});

test(`stringMatching(regexp)`, () => {
  const result = prettyFormat(expect.stringMatching(/(elric|niema).*/), options);
  expect(result).toEqual('StringMatching /(elric|niema).*/');
});

test(`stringMatching(regexp) {escapeRegex: false}`, () => {
  const result = prettyFormat(expect.stringMatching(/regexp\d/gi), options);
  expect(result).toEqual('StringMatching /regexp\\d/gi');
});

test(`stringMatching(regexp) {escapeRegex: true}`, () => {
  options.escapeRegex = true;
  const result = prettyFormat(expect.stringMatching(/regexp\d/gi), options);
  expect(result).toEqual('StringMatching /regexp\\\\d/gi');
});

test(`stringNotMatching(string)`, () => {
  const result = prettyFormat(expect.not.stringMatching('elric'), options);
  expect(result).toEqual('StringNotMatching /elric/');
});

test(`supports multiple nested asymmetric matchers`, () => {
  const result = prettyFormat(
    {
      test: {
        nested: expect.objectContaining({
          a: expect.arrayContaining([1]),
          b: expect.anything(),
          c: expect.any(String),
          d: expect.stringContaining('elric'),
          e: expect.stringMatching('elric'),
          f: expect.objectContaining({test: 'case'}),
        }),
      },
    },
    options,
  );
  expect(result).toEqual(`Object {
  "test": Object {
    "nested": ObjectContaining {
      "a": ArrayContaining [
        1,
      ],
      "b": Anything,
      "c": Any<String>,
      "d": StringContaining "elric",
      "e": StringMatching /elric/,
      "f": ObjectContaining {
        "test": "case",
      },
    },
  },
}`);
});

describe(`indent option`, () => {
  const val = {
    nested: expect.objectContaining({
      a: expect.arrayContaining([1]),
      b: expect.anything(),
      c: expect.any(String),
      d: expect.stringContaining('elric'),
      e: expect.stringMatching('elric'),
      f: expect.objectContaining({
        composite: ['exact', 'match'],
        primitive: 'string',
      }),
    }),
  };
  const result = `Object {
  "nested": ObjectContaining {
    "a": ArrayContaining [
      1,
    ],
    "b": Anything,
    "c": Any<String>,
    "d": StringContaining "elric",
    "e": StringMatching /elric/,
    "f": ObjectContaining {
      "composite": Array [
        "exact",
        "match",
      ],
      "primitive": "string",
    },
  },
}`;

  test(`default implicit: 2 spaces`, () => {
    expect(prettyFormat(val, options)).toEqual(result);
  });
  test(`default explicit: 2 spaces`, () => {
    options.indent = 2;
    expect(prettyFormat(val, options)).toEqual(result);
  });

  // Tests assume that no strings in val contain multiple adjacent spaces!
  test(`non-default: 0 spaces`, () => {
    options.indent = 0;
    expect(prettyFormat(val, options)).toEqual(result.replace(/ {2}/g, ''));
  });
  test('non-default: 4 spaces', () => {
    options.indent = 4;
    expect(prettyFormat(val, options)).toEqual(
      result.replace(/ {2}/g, ' '.repeat(4)),
    );
  });
});

describe(`maxDepth option`, () => {
  test(`matchers as leaf nodes`, () => {
    options.maxDepth = 2;
    const val = {
      // ++depth === 1
      nested: [
        // ++depth === 2
        expect.arrayContaining(
          // ++depth === 3
          [1],
        ),
        expect.objectContaining({
          // ++depth === 3
          composite: ['exact', 'match'],
          primitive: 'string',
        }),
        expect.stringContaining('elric'),
        expect.stringMatching('elric'),
        expect.any(String),
        expect.anything(),
      ],
    };
    const result = prettyFormat(val, options);
    expect(result).toEqual(`Object {
  "nested": Array [
    [ArrayContaining],
    [ObjectContaining],
    StringContaining "elric",
    StringMatching /elric/,
    Any<String>,
    Anything,
  ],
}`);
  });
  test(`matchers as internal nodes`, () => {
    options.maxDepth = 2;
    const val = [
      // ++depth === 1
      expect.arrayContaining([
        // ++depth === 2
        'printed',
        {
          // ++depth === 3
          properties: 'not printed',
        },
      ]),
      expect.objectContaining({
        // ++depth === 2
        array: [
          // ++depth === 3
          'items',
          'not',
          'printed',
        ],
        primitive: 'printed',
      }),
    ];
    const result = prettyFormat(val, options);
    expect(result).toEqual(`Array [
  ArrayContaining [
    "printed",
    [Object],
  ],
  ObjectContaining {
    "array": [Array],
    "primitive": "printed",
  },
]`);
  });
});

test(`min option`, () => {
  options.min = true;
  const result = prettyFormat(
    {
      test: {
        nested: expect.objectContaining({
          a: expect.arrayContaining([1]),
          b: expect.anything(),
          c: expect.any(String),
          d: expect.stringContaining('elric'),
          e: expect.stringMatching('elric'),
          f: expect.objectContaining({test: 'case'}),
        }),
      },
    },
    options,
  );
  expect(result).toEqual(
    `{"test": {"nested": ObjectContaining {"a": ArrayContaining [1], "b": Anything, "c": Any<String>, "d": StringContaining "elric", "e": StringMatching /elric/, "f": ObjectContaining {"test": "case"}}}}`,
  );
});
