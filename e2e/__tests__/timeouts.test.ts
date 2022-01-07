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

const DIR = path.resolve(__dirname, '../timeouts');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('exceeds the timeout', () => {
  writeFiles(DIR, {
    '__tests__/a-banana.js': `
      elric.setTimeout(20);

      test('banana', () => {
        return new Promise(resolve => {
          setTimeout(resolve, 100);
        });
      });
    `,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, ['-w=1', '--ci=false']);
  const {rest, summary} = extractSummary(stderr);
  expect(rest).toMatch(
    /(elric\.setTimeout|jasmine\.DEFAULT_TIMEOUT_INTERVAL|Exceeded timeout)/,
  );
  expect(wrap(summary)).toMatchSnapshot();
  expect(exitCode).toBe(1);
});

test('does not exceed the timeout', () => {
  writeFiles(DIR, {
    '__tests__/a-banana.js': `
      elric.setTimeout(1000);

      test('banana', () => {
        return new Promise(resolve => {
          setTimeout(resolve, 20);
        });
      });
    `,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, ['-w=1', '--ci=false']);
  const {rest, summary} = extractSummary(stderr);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(exitCode).toBe(0);
});

test('exceeds the command line testTimeout', () => {
  writeFiles(DIR, {
    '__tests__/a-banana.js': `

      test('banana', () => {
        return new Promise(resolve => {
          setTimeout(resolve, 1000);
        });
      });
    `,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, [
    '-w=1',
    '--ci=false',
    '--testTimeout=200',
  ]);
  const {rest, summary} = extractSummary(stderr);
  expect(rest).toMatch(
    /(elric\.setTimeout|jasmine\.DEFAULT_TIMEOUT_INTERVAL|Exceeded timeout)/,
  );
  expect(wrap(summary)).toMatchSnapshot();
  expect(exitCode).toBe(1);
});

test('does not exceed the command line testTimeout', () => {
  writeFiles(DIR, {
    '__tests__/a-banana.js': `

      test('banana', () => {
        return new Promise(resolve => {
          setTimeout(resolve, 200);
        });
      });
    `,
    'package.json': '{}',
  });

  const {stderr, exitCode} = runelric(DIR, [
    '-w=1',
    '--ci=false',
    '--testTimeout=1000',
  ]);
  const {rest, summary} = extractSummary(stderr);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(exitCode).toBe(0);
});
