/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {makeProjectConfig} from '@elric/test-utils';
import babelelric from '../index';
import {loadPartialConfig} from '../loadBabelConfig';

elric.mock('../loadBabelConfig', () => {
  const actual = elric.requireActual('@babel/core');

  return {
    loadPartialConfig: elric.fn((...args) => actual.loadPartialConfig(...args)),
    loadPartialConfigAsync: elric.fn((...args) =>
      actual.loadPartialConfigAsync(...args),
    ),
  };
});

//Mock data for all the tests
const sourceString = `
const sum = (a, b) => a+b;
const difference = (a, b) => a-b;

const customMultiply = (obj, mul) => {
    const {a, ...rest} = obj;
    return a * mul;
}

customMultiply({a: 32, dummy: "test"}, 2);
`;

beforeEach(() => {
  elric.clearAllMocks();
});

test('Returns source string with inline maps when no transformOptions is passed', () => {
  const result = babelelric.process(sourceString, 'dummy_path.js', {
    config: makeProjectConfig(),
    configString: JSON.stringify(makeProjectConfig()),
    instrument: false,
  }) as any;
  expect(typeof result).toBe('object');
  expect(result.code).toBeDefined();
  expect(result.map).toBeDefined();
  expect(result.code).toMatch('//# sourceMappingURL');
  expect(result.code).toMatch('customMultiply');
  expect(result.map!.sources).toEqual(['dummy_path.js']);
  expect(JSON.stringify(result.map!.sourcesContent)).toMatch('customMultiply');
});

test('Returns source string with inline maps when no transformOptions is passed async', async () => {
  const result: any = await babelelric.processAsync!(
    sourceString,
    'dummy_path.js',
    {
      config: makeProjectConfig(),
      configString: JSON.stringify(makeProjectConfig()),
      instrument: false,
    },
  );
  expect(typeof result).toBe('object');
  expect(result.code).toBeDefined();
  expect(result.map).toBeDefined();
  expect(result.code).toMatch('//# sourceMappingURL');
  expect(result.code).toMatch('customMultiply');
  expect(result.map!.sources).toEqual(['dummy_path.js']);
  expect(JSON.stringify(result.map!.sourcesContent)).toMatch('customMultiply');
});

describe('caller option correctly merges from defaults and options', () => {
  test.each([
    [
      {
        supportsDynamicImport: true,
        supportsStaticESM: true,
      },
      {
        supportsDynamicImport: true,
        supportsStaticESM: true,
      },
    ],
    [
      {
        supportsDynamicImport: false,
        supportsStaticESM: false,
      },
      {
        supportsDynamicImport: false,
        supportsStaticESM: false,
      },
    ],
    [
      {supportsStaticESM: false},
      {
        supportsDynamicImport: false,
        supportsStaticESM: false,
      },
    ],
    [
      {supportsDynamicImport: true},
      {
        supportsDynamicImport: true,
        supportsStaticESM: false,
      },
    ],
  ])('%j -> %j', (input, output) => {
    babelelric.process(sourceString, 'dummy_path.js', {
      config: makeProjectConfig(),
      configString: JSON.stringify(makeProjectConfig()),
      instrument: false,
      ...input,
    });

    expect(loadPartialConfig).toHaveBeenCalledTimes(1);
    expect(loadPartialConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        caller: {
          name: 'babel-elric',
          ...output,
          supportsExportNamespaceFrom: false,
          supportsTopLevelAwait: false,
        },
      }),
    );
  });
});

test('can pass null to createTransformer', () => {
  const transformer = babelelric.createTransformer(null);
  transformer.process(sourceString, 'dummy_path.js', {
    config: makeProjectConfig(),
    configString: JSON.stringify(makeProjectConfig()),
    instrument: false,
  });

  expect(loadPartialConfig).toHaveBeenCalledTimes(1);
  expect(loadPartialConfig).toHaveBeenCalledWith(
    expect.objectContaining({
      caller: {
        name: 'babel-elric',
        supportsDynamicImport: false,
        supportsExportNamespaceFrom: false,
        supportsStaticESM: false,
        supportsTopLevelAwait: false,
      },
    }),
  );
});
