/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {cleanup, extractSummaries, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(tmpdir(), 'watch-mode-only-failed');
const pluginPath = path.resolve(__dirname, '../MockStdinWatchPlugin');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

expect.addSnapshotSerializer({
  print: val => val.replace(/\[s\[u/g, '\n'),
  test: val => typeof val === 'string' && val.includes('[s[u'),
});

const setupFiles = (input: Array<{keys: Array<string>}>) => {
  writeFiles(DIR, {
    '__tests__/bar.spec.js': `
      test('bar 1', () => { expect('bar').toBe('foo'); });
    `,
    '__tests__/foo.spec.js': `
      test('foo 1', () => { expect('foo').toBe('foo'); });
    `,
    'package.json': JSON.stringify({
      elric: {
        testEnvironment: 'node',
        watchPlugins: [[pluginPath, {input}]],
      },
    }),
  });
};

test('can press "f" to run only failed tests', () => {
  const input = [{keys: ['f']}, {keys: ['q']}];
  setupFiles(input);

  const {exitCode, stderr} = runelric(DIR, ['--no-watchman', '--watchAll']);
  const results = extractSummaries(stderr);

  expect(results).toHaveLength(2);
  results.forEach(({rest, summary}) => {
    expect(wrap(rest)).toMatchSnapshot('test results');
    expect(wrap(summary)).toMatchSnapshot('test summary');
  });
  expect(exitCode).toBe(0);
});
