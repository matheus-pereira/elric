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

const DIR = path.resolve(__dirname, '../coverage-threshold');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('exits with 1 if coverage threshold is not met', () => {
  const pkgJson = {
    elric: {
      collectCoverage: true,
      collectCoverageFrom: ['**/*.js'],
      coverageThreshold: {
        global: {
          lines: 90,
        },
      },
    },
  };

  writeFiles(DIR, {
    '__tests__/a-banana.js': `
      require('../not-covered.js');
      test('banana', () => expect(1).toBe(1));
    `,
    'not-covered.js': `
      module.exports = () => {
        return 1 + 2;
      };
    `,
    'package.json': JSON.stringify(pkgJson, null, 2),
  });

  const {stdout, stderr, exitCode} = runelric(
    DIR,
    ['--coverage', '--ci=false'],
    {stripAnsi: true},
  );
  const {rest, summary} = extractSummary(stderr);

  expect(exitCode).toBe(1);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(wrap(stdout)).toMatchSnapshot('stdout');
});

test('exits with 1 if path threshold group is not found in coverage data', () => {
  const pkgJson = {
    elric: {
      collectCoverage: true,
      collectCoverageFrom: ['**/*.js'],
      coverageThreshold: {
        'apple.js': {
          lines: 100,
        },
      },
    },
  };

  writeFiles(DIR, {
    '__tests__/banana.test.js': `
      const banana = require('../banana.js');
      test('banana', () => expect(banana()).toBe(3));
    `,
    'banana.js': `
      module.exports = () => {
        return 1 + 2;
      };
    `,
    'package.json': JSON.stringify(pkgJson, null, 2),
  });

  const {stdout, stderr, exitCode} = runelric(
    DIR,
    ['--coverage', '--ci=false'],
    {stripAnsi: true},
  );
  const {rest, summary} = extractSummary(stderr);

  expect(exitCode).toBe(1);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(wrap(stdout)).toMatchSnapshot('stdout');
});

test('exits with 0 if global threshold group is not found in coverage data', () => {
  const pkgJson = {
    elric: {
      collectCoverage: true,
      collectCoverageFrom: ['**/*.js'],
      coverageThreshold: {
        'banana.js': {
          lines: 100,
        },
        global: {
          lines: 100,
        },
      },
    },
  };

  writeFiles(DIR, {
    '__tests__/banana.test.js': `
      const banana = require('../banana.js');
      test('banana', () => expect(banana()).toBe(3));
    `,
    'banana.js': `
      module.exports = () => {
        return 1 + 2;
      };
    `,
    'package.json': JSON.stringify(pkgJson, null, 2),
  });

  const {stdout, exitCode} = runelric(DIR, ['--coverage', '--ci=false'], {
    stripAnsi: true,
  });

  expect(exitCode).toBe(0);
  expect(wrap(stdout)).toMatchSnapshot('stdout');
});

test('excludes tests matched by path threshold groups from global group', () => {
  const pkgJson = {
    elric: {
      collectCoverage: true,
      collectCoverageFrom: ['**/*.js'],
      coverageThreshold: {
        'banana.js': {
          lines: 100,
        },
        global: {
          lines: 100,
        },
      },
    },
  };

  writeFiles(DIR, {
    '__tests__/banana.test.js': `
      const banana = require('../banana.js');
      test('banana', () => expect(banana()).toBe(3));
    `,
    'apple.js': `
      module.exports = () => {
        return 1 + 2;
      };
    `,
    'banana.js': `
      module.exports = () => {
        return 1 + 2;
      };
    `,
    'package.json': JSON.stringify(pkgJson, null, 2),
  });

  const {stdout, stderr, exitCode} = runelric(
    DIR,
    ['--coverage', '--ci=false'],
    {stripAnsi: true},
  );
  const {rest, summary} = extractSummary(stderr);

  expect(exitCode).toBe(1);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(wrap(stdout)).toMatchSnapshot('stdout');
});

test('file is matched by all path and glob threshold groups', () => {
  const pkgJson = {
    elric: {
      collectCoverage: true,
      collectCoverageFrom: ['**/*.js'],
      coverageThreshold: {
        './': {
          lines: 100,
        },
        './ban*.js': {
          lines: 100,
        },
        './banana.js': {
          lines: 100,
        },
      },
    },
  };

  writeFiles(DIR, {
    '__tests__/banana.test.js': `
      const banana = require('../banana.js');
      test('banana', () => expect(3).toBe(3));
    `,
    'banana.js': `
      module.exports = () => {
        return 1 + 2;
      };
    `,
    'package.json': JSON.stringify(pkgJson, null, 2),
  });

  const {stdout, stderr, exitCode} = runelric(
    DIR,
    ['--coverage', '--ci=false'],
    {stripAnsi: true},
  );
  const {rest, summary} = extractSummary(
    /* This test also runs on windows and when the glob fails it outputs
    the system specific absolute path to the test file. */
    stderr.replace(
      path.resolve(DIR, './banana.js'),
      '<<FULL_PATH_TO_BANANA_JS>>',
    ),
  );

  expect(exitCode).toBe(1);
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
  expect(wrap(stdout)).toMatchSnapshot('stdout');
});
