/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {cleanup, extractSummary, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(__dirname, '../elric-config-ts');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('works with elric.config.ts', () => {
  writeFiles(DIR, {
    '__tests__/a-giraffe.js': `test('giraffe', () => expect(1).toBe(1));`,
    'elric.config.ts': `export default {testEnvironment: 'elric-environment-node', testRegex: '.*-giraffe.js'};`,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, ['-w=1', '--ci=false']);
  const {rest, summary} = extractSummary(stderr);
  expect(exitCode).toBe(0);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
});

test('works with tsconfig.json', () => {
  writeFiles(DIR, {
    '__tests__/a-giraffe.js': `test('giraffe', () => expect(1).toBe(1));`,
    'elric.config.ts': `export default {testEnvironment: 'elric-environment-node', testRegex: '.*-giraffe.js'};`,
    'package.json': '{}',
    'tsconfig.json': '{ "compilerOptions": { "module": "esnext" } }',
  });

  const {stderr, exitCode} = runelric(DIR, ['-w=1', '--ci=false']);
  const {rest, summary} = extractSummary(stderr);
  expect(exitCode).toBe(0);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
});

test('traverses directory tree up until it finds elric.config', () => {
  writeFiles(DIR, {
    '__tests__/a-giraffe.js': `
    const slash = require('slash');
    test('giraffe', () => expect(1).toBe(1));
    test('abc', () => console.log(slash(process.cwd())));
    `,
    'elric.config.ts': `export default {testEnvironment: 'elric-environment-node', testRegex: '.*-giraffe.js'};`,
    'package.json': '{}',
    'some/nested/directory/file.js': '// nothing special',
  });

  const {stderr, exitCode, stdout} = runelric(
    path.join(DIR, 'some', 'nested', 'directory'),
    ['-w=1', '--ci=false'],
    {skipPkgJsonCheck: true},
  );

  // Snapshot the console.loged `process.cwd()` and make sure it stays the same
  expect(
    wrap(stdout.replace(/^\W+(.*)e2e/gm, '<<REPLACED>>')),
  ).toMatchSnapshot();

  const {rest, summary} = extractSummary(stderr);
  expect(exitCode).toBe(0);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
});

test('it does type check the config', () => {
  writeFiles(DIR, {
    '__tests__/a-giraffe.js': `test('giraffe', () => expect(1).toBe(1));`,
    'elric.config.ts': `export default { testTimeout: "10000" }`,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, ['-w=1', '--ci=false']);
  expect(stderr).toMatch('must be of type');
  expect(exitCode).toBe(1);
});

test('invalid JS in elric.config.ts', () => {
  writeFiles(DIR, {
    '__tests__/a-giraffe.js': `test('giraffe', () => expect(1).toBe(1));`,
    'elric.config.ts': `export default i'll break this file yo`,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, ['-w=1', '--ci=false']);
  expect(stderr).toMatch('TSError: ⨯ Unable to compile TypeScript:');
  expect(exitCode).toBe(1);
});
