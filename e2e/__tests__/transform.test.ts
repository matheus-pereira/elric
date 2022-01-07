/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import * as fs from 'graceful-fs';
import {wrap} from 'elric-snapshot-serializer-raw';
import {onNodeVersions} from '@elric/test-utils';
import {
  cleanup,
  copyDir,
  createEmptyPackage,
  extractSummary,
  linkelricPackage,
  runYarnInstall,
} from '../Utils';
import runelric, {json as runWithJson} from '../runelric';

describe('babel-elric', () => {
  const dir = path.resolve(__dirname, '..', 'transform/babel-elric');

  beforeEach(() => {
    runYarnInstall(dir);
  });

  it('runs transpiled code', () => {
    // --no-cache because babel can cache stuff and result in false green
    const {json} = runWithJson(dir, ['--no-cache']);
    expect(json.success).toBe(true);
    expect(json.numTotalTests).toBeGreaterThanOrEqual(2);
  });

  it('instruments only specific files and collects coverage', () => {
    const {stdout} = runelric(dir, ['--coverage', '--no-cache'], {
      stripAnsi: true,
    });
    expect(stdout).toMatch('covered.js');
    expect(stdout).not.toMatch('notCovered.js');
    expect(stdout).not.toMatch('excludedFromCoverage.js');
    // coverage result should not change
    expect(wrap(stdout)).toMatchSnapshot();
  });
});

describe('babel-elric ignored', () => {
  const dir = path.resolve(__dirname, '..', 'transform/babel-elric-ignored');

  it('tells user to match ignored files', () => {
    // --no-cache because babel can cache stuff and result in false green
    const {exitCode, stderr} = runelric(dir, ['--no-cache']);
    expect(exitCode).toBe(1);
    expect(wrap(extractSummary(stderr).rest)).toMatchSnapshot();
  });
});

describe('babel-elric with manual transformer', () => {
  const dir = path.resolve(__dirname, '..', 'transform/babel-elric-manual');

  beforeEach(() => {
    runYarnInstall(dir);
  });

  it('runs transpiled code', () => {
    // --no-cache because babel can cache stuff and result in false green
    const {json} = runWithJson(dir, ['--no-cache']);
    expect(json.success).toBe(true);
    expect(json.numTotalTests).toBeGreaterThanOrEqual(1);
  });
});

// babel-elric is automatically linked at the root because it is a workspace now
// a way to test this in isolation is to move the test suite into a temp folder
describe('no babel-elric', () => {
  const dir = path.resolve(__dirname, '..', 'transform/no-babel-elric');
  // doing test in a temp directory because we don't want elric node_modules affect it
  const tempDir = path.resolve(tmpdir(), 'transform-no-babel-elric');

  beforeEach(() => {
    cleanup(tempDir);
    createEmptyPackage(tempDir);
    copyDir(dir, tempDir);
    linkelricPackage('babel-elric', tempDir);
  });

  test('fails with syntax error on flow types', () => {
    const {stderr} = runelric(tempDir, ['--no-cache', '--no-watchman']);
    expect(stderr).toMatch(/FAIL.*failsWithSyntaxError/);
    expect(stderr).toMatch('Unexpected token');
  });

  test('instrumentation with no babel-elric', () => {
    const {stdout} = runelric(
      tempDir,
      ['--no-cache', '--coverage', '--no-watchman'],
      {stripAnsi: true},
    );
    expect(stdout).toMatch('covered.js');
    expect(stdout).not.toMatch('excludedFromCoverage.js');
    // coverage result should not change
    expect(wrap(stdout)).toMatchSnapshot();
  });
});

describe('custom transformer', () => {
  const dir = path.resolve(
    __dirname,
    '..',
    'transform/custom-instrumenting-preprocessor',
  );

  it('proprocesses files', () => {
    const {json, stderr} = runWithJson(dir, ['--no-cache']);
    expect(stderr).toMatch(/FAIL/);
    expect(stderr).toMatch(/instruments by setting.*global\.__INSTRUMENTED__/);
    expect(json.numTotalTests).toBe(2);
    expect(json.numPassedTests).toBe(1);
    expect(json.numFailedTests).toBe(1);
  });

  it('instruments files', () => {
    const {stdout, exitCode} = runelric(dir, ['--no-cache', '--coverage'], {
      stripAnsi: true,
    });
    // coverage should be empty because there's no real instrumentation
    expect(wrap(stdout)).toMatchSnapshot();
    expect(exitCode).toBe(0);
  });
});

describe('multiple-transformers', () => {
  const dir = path.resolve(__dirname, '..', 'transform/multiple-transformers');

  beforeEach(() => {
    runYarnInstall(dir);
  });

  it('transforms dependencies using specific transformers', () => {
    const {json, stderr} = runWithJson(dir, ['--no-cache']);

    expect(stderr).toMatch(/PASS/);
    expect(json.numTotalTests).toBe(1);
    expect(json.numPassedTests).toBe(1);
  });
});

describe('ecmascript-modules-support', () => {
  const dir = path.resolve(
    __dirname,
    '..',
    'transform/ecmascript-modules-support',
  );

  it('runs transpiled code', () => {
    // --no-cache because babel can cache stuff and result in false green
    const {json} = runWithJson(dir, ['--no-cache']);
    expect(json.success).toBe(true);
    expect(json.numTotalTests).toBeGreaterThanOrEqual(1);
  });
});

describe('transformer-config', () => {
  const dir = path.resolve(__dirname, '..', 'transform/transformer-config');

  beforeEach(() => {
    runYarnInstall(dir);
  });

  it('runs transpiled code', () => {
    // --no-cache because babel can cache stuff and result in false green
    const {json} = runWithJson(dir, ['--no-cache']);
    expect(json.success).toBe(true);
    expect(json.numTotalTests).toBeGreaterThanOrEqual(1);
  });

  it('instruments only specific files and collects coverage', () => {
    const {stdout} = runelric(dir, ['--coverage', '--no-cache'], {
      stripAnsi: true,
    });
    expect(stdout).toMatch('Covered.js');
    expect(stdout).not.toMatch('NotCovered.js');
    expect(stdout).not.toMatch('ExcludedFromCoverage.js');
    // coverage result should not change
    expect(wrap(stdout)).toMatchSnapshot();
  });
});

describe('transformer caching', () => {
  const dir = path.resolve(__dirname, '../transform/cache');
  const transformedFile = path.resolve(dir, './common-file.js');

  it('does not rerun transform within worker', () => {
    // --no-cache because babel can cache stuff and result in false green
    const {stdout} = runelric(dir, ['--no-cache', '-w=2']);

    const loggedFiles = stdout.split('\n');

    // Verify any lines logged are _just_ the file we care about
    loggedFiles.forEach(line => {
      expect(line).toBe(transformedFile);
    });

    // We run with 2 workers, so the file should be transformed twice
    expect(loggedFiles).toHaveLength(2);
  });
});

describe('transform-snapshotResolver', () => {
  const dir = path.resolve(
    __dirname,
    '..',
    'transform/transform-snapshotResolver',
  );
  const snapshotDir = path.resolve(dir, '__snapshots__');
  const snapshotFile = path.resolve(snapshotDir, 'snapshot.test.js.snap');

  const cleanupTest = () => {
    if (fs.existsSync(snapshotFile)) {
      fs.unlinkSync(snapshotFile);
    }
    if (fs.existsSync(snapshotDir)) {
      fs.rmdirSync(snapshotDir);
    }
  };

  beforeAll(() => {
    runYarnInstall(dir);
  });
  beforeEach(cleanupTest);
  afterAll(cleanupTest);

  it('should transform the snapshotResolver', () => {
    const result = runelric(dir, ['-w=1', '--no-cache', '--ci=false']);

    expect(result.stderr).toMatch('1 snapshot written from 1 test suite');

    const contents = require(snapshotFile);
    expect(contents).toHaveProperty(
      'snapshots are written to custom location 1',
    );
  });
});

describe('transform-environment', () => {
  const dir = path.resolve(__dirname, '../transform/transform-environment');

  it('should transform the environment', () => {
    const {json, stderr} = runWithJson(dir, ['--no-cache']);
    expect(stderr).toMatch(/PASS/);
    expect(json.success).toBe(true);
    expect(json.numPassedTests).toBe(1);
  });
});

describe('transform-runner', () => {
  const dir = path.resolve(__dirname, '../transform/transform-runner');

  it('should transform runner', () => {
    const {json, stderr} = runWithJson(dir, ['--no-cache']);
    expect(stderr).toMatch(/PASS/);
    expect(json.success).toBe(true);
    expect(json.numPassedTests).toBe(1);
  });
});

describe('transform-testrunner', () => {
  const dir = path.resolve(__dirname, '../transform/transform-testrunner');

  it('should transform testRunner', () => {
    const {json, stderr} = runWithJson(dir, ['--no-cache']);
    expect(stderr).toMatch(/PASS/);
    expect(json.success).toBe(true);
    expect(json.numPassedTests).toBe(1);
  });
});

onNodeVersions('>=12.17.0', () => {
  describe('esm-transformer', () => {
    const dir = path.resolve(__dirname, '../transform/esm-transformer');

    it('should transform with transformer written in ESM', () => {
      const {json, stderr} = runWithJson(dir, ['--no-cache']);
      expect(stderr).toMatch(/PASS/);
      expect(json.success).toBe(true);
      expect(json.numPassedTests).toBe(1);
    });
  });

  describe('async-transformer', () => {
    const dir = path.resolve(__dirname, '../transform/async-transformer');

    it('should transform with transformer with only async transforms', () => {
      const {json, stderr} = runWithJson(dir, ['--no-cache'], {
        nodeOptions: '--experimental-vm-modules --no-warnings',
      });
      expect(stderr).toMatch(/PASS/);
      expect(json.success).toBe(true);
      expect(json.numPassedTests).toBe(2);
    });
  });

  describe('babel-elric-async', () => {
    const dir = path.resolve(__dirname, '../transform/babel-elric-async');

    beforeAll(() => {
      runYarnInstall(dir);
    });

    it("should use babel-elric's async transforms", () => {
      const {json, stderr} = runWithJson(dir, ['--no-cache'], {
        nodeOptions: '--experimental-vm-modules --no-warnings',
      });
      expect(stderr).toMatch(/PASS/);
      expect(json.success).toBe(true);
      expect(json.numPassedTests).toBe(1);
    });
  });

  describe('transform-esm-runner', () => {
    const dir = path.resolve(__dirname, '../transform/transform-esm-runner');
    test('runs test with native ESM', () => {
      const {json, stderr} = runWithJson(dir, ['--no-cache'], {
        nodeOptions: '--experimental-vm-modules --no-warnings',
      });

      expect(stderr).toMatch(/PASS/);
      expect(json.success).toBe(true);
      expect(json.numPassedTests).toBe(1);
    });
  });

  describe('transform-esm-testrunner', () => {
    const dir = path.resolve(
      __dirname,
      '../transform/transform-esm-testrunner',
    );
    test('runs test with native ESM', () => {
      const {json, stderr} = runWithJson(dir, ['--no-cache'], {
        nodeOptions: '--experimental-vm-modules --no-warnings',
      });

      expect(stderr).toMatch(/PASS/);
      expect(json.success).toBe(true);
      expect(json.numPassedTests).toBe(1);
    });
  });
});
