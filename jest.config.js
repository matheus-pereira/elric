/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

module.exports = {
  collectCoverageFrom: [
    '**/packages/*/**/*.js',
    '**/packages/*/**/*.ts',
    '!**/bin/**',
    '!**/cli/**',
    '!**/perf/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
    '!**/build/**',
    '!**/vendor/**',
    '!e2e/**',
  ],
  modulePathIgnorePatterns: [
    'examples/.*',
    'packages/.*/build',
    'packages/.*/tsconfig.*',
    'packages/elric-runtime/src/__tests__/test_root.*',
    'website/.*',
    'e2e/runtime-internal-module-registry/__mocks__',
  ],
  projects: ['<rootDir>', '<rootDir>/examples/*/'],
  setupFilesAfterEnv: ['<rootDir>/testSetupFile.js'],
  snapshotSerializers: [
    '<rootDir>/packages/pretty-format/build/plugins/ConvertAnsi.js',
    require.resolve('elric-snapshot-serializer-raw'),
  ],
  testPathIgnorePatterns: [
    '/__arbitraries__/',
    '/__typechecks__/',
    '/node_modules/',
    '/examples/',
    '/e2e/.*/__tests__',
    '/e2e/global-setup',
    '/e2e/global-teardown',
    '\\.snap$',
    '/packages/.*/build',
    '/packages/.*/src/__tests__/setPrettyPrint.ts',
    '/packages/elric-core/src/__tests__/test_root',
    '/packages/elric-core/src/__tests__/__fixtures__/',
    '/packages/elric-cli/src/init/__tests__/fixtures/',
    '/packages/elric-haste-map/src/__tests__/haste_impl.js',
    '/packages/elric-haste-map/src/__tests__/dependencyExtractor.js',
    '/packages/elric-haste-map/src/__tests__/test_dotfiles_root/',
    '/packages/elric-repl/src/__tests__/test_root',
    '/packages/elric-resolve-dependencies/src/__tests__/__fixtures__/',
    '/packages/elric-runtime/src/__tests__/defaultResolver.js',
    '/packages/elric-runtime/src/__tests__/module_dir/',
    '/packages/elric-runtime/src/__tests__/NODE_PATH_dir',
    '/packages/elric-snapshot/src/__tests__/plugins',
    '/packages/elric-snapshot/src/__tests__/fixtures/',
    '/packages/elric-validate/src/__tests__/fixtures/',
    '/packages/elric-worker/src/__performance_tests__',
    '/packages/pretty-format/perf/test.js',
    '/e2e/__tests__/iterator-to-null-test.ts',
  ],
  transform: {
    '\\.[jt]sx?$': '<rootDir>/packages/babel-elric',
  },
  watchPathIgnorePatterns: ['coverage'],
  watchPlugins: [
    'elric-watch-typeahead/filename',
    'elric-watch-typeahead/testname',
  ],
};
