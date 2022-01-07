/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {onNodeVersions} from '@elric/test-utils';
import {cleanup, extractSummary, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(tmpdir(), 'custom-reporters-test-dir');

beforeEach(() => cleanup(DIR));
afterEach(() => cleanup(DIR));

describe('Custom Reporters Integration', () => {
  test('valid string format for adding reporters', () => {
    const reporterConfig = {
      reporters: ['<rootDir>/reporters/TestReporter.js'],
    };

    const {exitCode} = runelric('custom-reporters', [
      '--config',
      JSON.stringify(reporterConfig),
      'add.test.js',
    ]);

    expect(exitCode).toBe(0);
  });

  test('valid array format for adding reporters', () => {
    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/TestReporter.js', {'Aaron Abramov': 'Awesome'}],
      ],
    };

    const {exitCode, stdout} = runelric('custom-reporters', [
      '--config',
      JSON.stringify(reporterConfig),
      'add.test.js',
    ]);

    expect(wrap(stdout)).toMatchSnapshot();
    expect(exitCode).toBe(0);
  });

  test('invalid format for adding reporters', () => {
    const reporterConfig = {
      reporters: [[3243242]],
    };

    const {exitCode, stderr} = runelric('custom-reporters', [
      '--config',
      JSON.stringify(reporterConfig),
      'add.test.js',
    ]);

    expect(exitCode).toBe(1);
    expect(wrap(stderr)).toMatchSnapshot();
  });

  test('default reporters enabled', () => {
    const {stderr, stdout, exitCode} = runelric('custom-reporters', [
      '--config',
      JSON.stringify({
        reporters: ['default', '<rootDir>/reporters/TestReporter.js'],
      }),
      'add.test.js',
    ]);

    const {summary, rest} = extractSummary(stderr);
    const parsedJSON = JSON.parse(stdout);

    expect(exitCode).toBe(0);
    expect(wrap(rest)).toMatchSnapshot();
    expect(wrap(summary)).toMatchSnapshot();
    expect(parsedJSON).toMatchSnapshot();
  });

  test('TestReporter with all tests passing', () => {
    const {stdout, exitCode, stderr} = runelric('custom-reporters', [
      'add.test.js',
    ]);

    const parsedJSON = JSON.parse(stdout);

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(parsedJSON).toMatchSnapshot();
  });

  test('TestReporter with all tests failing', () => {
    const {stdout, exitCode, stderr} = runelric('custom-reporters', [
      'addFail.test.js',
    ]);

    const parsedJSON = JSON.parse(stdout);

    expect(exitCode).toBe(1);
    expect(stderr).toBe('');
    expect(parsedJSON).toMatchSnapshot();
  });

  test('IncompleteReporter for flexibility', () => {
    const {stderr, stdout, exitCode} = runelric('custom-reporters', [
      '--no-cache',
      '--config',
      JSON.stringify({
        reporters: ['<rootDir>/reporters/IncompleteReporter.js'],
      }),
      'add.test.js',
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');

    expect(wrap(stdout)).toMatchSnapshot();
  });

  test('reporters can be default exports', () => {
    const {stderr, stdout, exitCode} = runelric('custom-reporters', [
      '--no-cache',
      '--config',
      JSON.stringify({
        reporters: ['<rootDir>/reporters/DefaultExportReporter.js'],
      }),
      'add.test.js',
    ]);

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
    expect(wrap(stdout)).toMatchSnapshot();
  });

  test('prints reporter errors', () => {
    writeFiles(DIR, {
      '__tests__/test.test.js': `test('test', () => {});`,
      'package.json': JSON.stringify({
        elric: {
          reporters: ['default', '<rootDir>/reporter.js'],
          testEnvironment: 'node',
        },
      }),
      'reporter.js': `
        'use strict';
        module.exports = class Reporter {
          onRunStart() {
            throw new Error('ON_RUN_START_ERROR');
          }
        };
      `,
    });

    const {stderr, exitCode} = runelric(DIR);
    expect(stderr).toMatch(/ON_RUN_START_ERROR/);
    expect(exitCode).toBe(1);
  });

  onNodeVersions('>=12.17.0', () => {
    test('supports reporter written in ESM', () => {
      writeFiles(DIR, {
        '__tests__/test.test.js': `test('test', () => {});`,
        'package.json': JSON.stringify({
          elric: {
            reporters: ['default', '<rootDir>/reporter.mjs'],
            testEnvironment: 'node',
          },
        }),
        'reporter.mjs': `
        export default class Reporter {
          onRunStart() {
            throw new Error('ON_RUN_START_ERROR');
          }
        };
      `,
      });

      const {stderr, exitCode} = runelric(DIR);
      expect(stderr).toMatch(/ON_RUN_START_ERROR/);
      expect(exitCode).toBe(1);
    });
  });
});
