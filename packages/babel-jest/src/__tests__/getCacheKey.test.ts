/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {TransformOptions as BabelTransformOptions} from '@babel/core';
import type {TransformOptions as elricTransformOptions} from '@elric/transform';
import babelelric from '../index';

const processVersion = process.version;
const nodeEnv = process.env.NODE_ENV;
const babelEnv = process.env.BABEL_ENV;

afterEach(() => {
  elric.resetModules();

  if (process.version === 'new-node-version') {
    process.version = processVersion;
  }

  if (process.env.NODE_ENV === 'NEW_NODE_ENV') {
    process.env.NODE_ENV = nodeEnv;
  }

  if (process.env.BABEL_ENV === 'NEW_BABEL_ENV') {
    process.env.BABEL_ENV = babelEnv;
  }
});

describe('getCacheKey', () => {
  const sourceText = 'mock source';
  const sourcePath = 'mock-source-path.js';

  const transformOptions = {
    config: {rootDir: 'mock-root-dir'},
    configString: 'mock-config-string',
    instrument: true,
  } as elricTransformOptions;

  const oldCacheKey = babelelric.getCacheKey(
    sourceText,
    sourcePath,
    transformOptions,
  );

  test('returns cache key hash', () => {
    expect(oldCacheKey.length).toEqual(32);
  });

  test('if `THIS_FILE` value is changing', () => {
    elric.doMock('graceful-fs', () => ({
      readFileSync: () => 'new this file',
    }));

    const {default: babelelric}: typeof import('../index') = require('../index');

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `babelOptions.options` value is changing', () => {
    elric.doMock('../loadBabelConfig', () => {
      const babel: typeof import('@babel/core') = require('@babel/core');

      return {
        loadPartialConfig: (options: BabelTransformOptions) => ({
          ...babel.loadPartialConfig(options),
          options: 'new-options',
        }),
      };
    });

    const {default: babelelric}: typeof import('../index') = require('../index');

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `sourceText` value is changing', () => {
    const newCacheKey = babelelric.getCacheKey(
      'new source text',
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `sourcePath` value is changing', () => {
    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      'new-source-path.js',
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `configString` value is changing', () => {
    const newCacheKey = babelelric.getCacheKey(sourceText, sourcePath, {
      ...transformOptions,
      configString: 'new-config-string',
    });

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `babelOptions.config` value is changing', () => {
    elric.doMock('../loadBabelConfig', () => {
      const babel: typeof import('@babel/core') = require('@babel/core');

      return {
        loadPartialConfig: (options: BabelTransformOptions) => ({
          ...babel.loadPartialConfig(options),
          config: 'new-config',
        }),
      };
    });

    const {default: babelelric}: typeof import('../index') = require('../index');

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `babelOptions.babelrc` value is changing', () => {
    elric.doMock('../loadBabelConfig', () => {
      const babel: typeof import('@babel/core') = require('@babel/core');

      return {
        loadPartialConfig: (options: BabelTransformOptions) => ({
          ...babel.loadPartialConfig(options),
          babelrc: 'new-babelrc',
        }),
      };
    });

    const {default: babelelric}: typeof import('../index') = require('../index');

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `instrument` value is changing', () => {
    const newCacheKey = babelelric.getCacheKey(sourceText, sourcePath, {
      ...transformOptions,
      instrument: false,
    });

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `process.env.NODE_ENV` value is changing', () => {
    process.env.NODE_ENV = 'NEW_NODE_ENV';

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if `process.env.BABEL_ENV` value is changing', () => {
    process.env.BABEL_ENV = 'NEW_BABEL_ENV';

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });

  test('if node version is changing', () => {
    delete process.version;
    process.version = 'new-node-version';

    const newCacheKey = babelelric.getCacheKey(
      sourceText,
      sourcePath,
      transformOptions,
    );

    expect(oldCacheKey).not.toEqual(newCacheKey);
  });
});
