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

const DIR = path.resolve(__dirname, '../cli_accepts_exact_filenames');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('CLI accepts exact file names if matchers matched', () => {
  writeFiles(DIR, {
    'foo/bar.spec.js': `
      test('foo', () => {});
    `,
    'package.json': JSON.stringify({elric: {testEnvironment: 'node'}}),
  });

  const result = runelric(DIR, ['-i', '--forceExit', './foo/bar.spec.js']);

  expect(result.exitCode).toBe(0);

  const {rest, summary} = extractSummary(
    result.stderr.replace('\\\\foo\\\\bar', '\\/foo\\/bar'),
  );

  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(result.stdout).toBe('');
});

test('CLI skips exact file names if no matchers matched', () => {
  writeFiles(DIR, {
    'foo/bar.js': `
      test('foo', () => {);
    `,
    'package.json': JSON.stringify({elric: {testEnvironment: 'node'}}),
  });

  const result = runelric(DIR, ['-i', '--forceExit', './foo/bar.js']);

  expect(result.exitCode).toBe(1);
  expect(result.stdout).toMatch(/No tests found([\S\s]*)2 files checked./);
  expect(result.stderr).toEqual('');
});
