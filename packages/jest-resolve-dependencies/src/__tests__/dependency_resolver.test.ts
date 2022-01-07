/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {makeProjectConfig} from '@elric/test-utils';
import type {Config} from '@elric/types';
import type Resolver from 'elric-resolve';
import {buildSnapshotResolver} from 'elric-snapshot';
import {DependencyResolver} from '../index';

const maxWorkers = 1;
let dependencyResolver: DependencyResolver;
let runtimeContextResolver: Resolver;
let Runtime: typeof import('elric-runtime');
let config: Config.ProjectConfig;
const cases: Record<string, elric.Mock> = {
  fancyCondition: elric.fn(path => path.length > 10),
  testRegex: elric.fn(path => /.test.js$/.test(path)),
};
const filter = (path: Config.Path) =>
  Object.keys(cases).every(key => cases[key](path));

beforeEach(async () => {
  Runtime = require('elric-runtime').default;
  config = makeProjectConfig({
    cacheDirectory: path.resolve(tmpdir(), 'elric-resolve-dependencies-test'),
    moduleDirectories: ['node_modules'],
    moduleNameMapper: [['^\\$asdf/(.*)$', '<rootDir>/$1']],
    rootDir: '.',
    roots: ['./packages/elric-resolve-dependencies'],
  });
  const runtimeContext = await Runtime.createContext(config, {
    maxWorkers,
    watchman: false,
  });

  runtimeContextResolver = runtimeContext.resolver;
  dependencyResolver = new DependencyResolver(
    runtimeContext.resolver,
    runtimeContext.hasteFS,
    await buildSnapshotResolver(config),
  );
});

test('resolves no dependencies for non-existent path', () => {
  const resolved = dependencyResolver.resolve('/non/existent/path');
  expect(resolved.length).toEqual(0);
});

test('resolves dependencies for existing path', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.js'),
  );
  expect(resolved).toEqual([
    expect.stringContaining('elric-resolve-dependencies'),
    expect.stringContaining('elric-regex-util'),
  ]);
});

test('includes the mocks of dependencies as dependencies', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__/hasMocked/file.test.js'),
  );

  expect(resolved).toEqual([
    expect.stringContaining(path.join('hasMocked', 'file.js')),
    expect.stringContaining(path.join('hasMocked', '__mocks__', 'file.js')),
    expect.stringContaining(path.join('__mocks__', 'fake-node-module.js')),
  ]);
});

test('resolves dependencies for scoped packages', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'scoped.js'),
  );
  expect(resolved).toEqual([
    expect.stringContaining(path.join('@myorg', 'pkg')),
  ]);
});

test('resolves no inverse dependencies for empty paths set', () => {
  const paths = new Set();
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved.length).toEqual(0);
});

test('resolves no inverse dependencies for set of non-existent paths', () => {
  const paths = new Set(['/non/existent/path', '/another/one']);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved.length).toEqual(0);
});

test('resolves inverse dependencies for existing path', () => {
  const paths = new Set([path.resolve(__dirname, '__fixtures__/file.js')]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toEqual([
    expect.stringContaining(
      path.join('__tests__', '__fixtures__', 'file.test.js'),
    ),
  ]);
});

test('resolves inverse dependencies of mock', () => {
  const paths = new Set([
    path.resolve(__dirname, '__fixtures__/hasMocked/__mocks__/file.js'),
  ]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);

  expect(resolved).toEqual([
    expect.stringContaining(
      path.join('__tests__/__fixtures__/hasMocked/file.test.js'),
    ),
  ]);
});

test('resolves inverse dependencies from available snapshot', () => {
  const paths = new Set([
    path.resolve(__dirname, '__fixtures__/file.js'),
    path.resolve(__dirname, '__fixtures__/__snapshots__/related.test.js.snap'),
  ]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toEqual(
    expect.arrayContaining([
      expect.stringContaining(
        path.join('__tests__', '__fixtures__', 'file.test.js'),
      ),
      expect.stringContaining(
        path.join('__tests__', '__fixtures__', 'related.test.js'),
      ),
    ]),
  );
});

test('resolves dependencies correctly when dependency resolution fails', () => {
  elric.spyOn(runtimeContextResolver, 'resolveModule').mockImplementation(() => {
    throw new Error('resolveModule has failed');
  });
  elric.spyOn(runtimeContextResolver, 'getMockModule').mockImplementation(() => {
    throw new Error('getMockModule has failed');
  });

  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.test.js'),
  );

  expect(resolved).toEqual([]);
});

test('resolves dependencies correctly when mock dependency resolution fails', () => {
  elric.spyOn(runtimeContextResolver, 'getMockModule').mockImplementation(() => {
    throw new Error('getMockModule has failed');
  });

  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.test.js'),
  );

  expect(resolved).toEqual([
    expect.stringContaining(path.join('__tests__', '__fixtures__', 'file.js')),
  ]);
});
