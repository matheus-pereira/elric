/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import * as fs from 'graceful-fs';
import {onNodeVersions} from '@elric/test-utils';
import {createDirectory} from 'elric-util';
import {cleanup, runYarnInstall} from '../Utils';
import runelric, {json as runWithJson} from '../runelric';

const DIR = path.join(tmpdir(), 'elric-global-teardown');
const project1DIR = path.join(tmpdir(), 'elric-global-teardown-project-1');
const project2DIR = path.join(tmpdir(), 'elric-global-teardown-project-2');
const e2eDir = path.resolve(__dirname, '../global-teardown');
const esmTmpDir = path.join(tmpdir(), 'elric-global-teardown-esm');

beforeAll(() => {
  runYarnInstall(e2eDir);
});

beforeEach(() => {
  cleanup(DIR);
  cleanup(project1DIR);
  cleanup(project2DIR);
  cleanup(esmTmpDir);
});
afterAll(() => {
  cleanup(DIR);
  cleanup(project1DIR);
  cleanup(project2DIR);
  cleanup(esmTmpDir);
});

test('globalTeardown is triggered once after all test suites', () => {
  createDirectory(DIR);
  const teardownPath = path.resolve(e2eDir, 'teardown.js');
  const result = runWithJson('global-teardown', [
    `--globalTeardown=${teardownPath}`,
    `--testPathPattern=__tests__`,
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const teardown = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(teardown).toBe('teardown');
});

test('elric throws an error when globalTeardown does not export a function', () => {
  const teardownPath = path.resolve(e2eDir, 'invalidTeardown.js');
  const {exitCode, stderr} = runelric(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    `--testPathPattern=__tests__`,
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('elric: Got error running globalTeardown');
  expect(stderr).toContain(
    `globalTeardown file must export a function at ${teardownPath}`,
  );
});

test('globalTeardown function gets elric config object as a parameter', () => {
  const teardownPath = path.resolve(e2eDir, 'teardownWithConfig.js');

  const testPathPattern = 'pass';

  const result = runelric(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    `--testPathPattern=${testPathPattern}`,
  ]);

  expect(result.stdout).toBe(testPathPattern);
});

test('should call globalTeardown function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.elric.config.js');

  const result = runWithJson('global-teardown', [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
});

test('should not call a globalTeardown of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.elric.config.js');

  const result = runWithJson('global-teardown', [
    `--config=${configPath}`,
    '--testPathPattern=project-1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
});

test('globalTeardown works with default export', () => {
  const teardownPath = path.resolve(e2eDir, 'teardownWithDefaultExport.js');

  const testPathPattern = 'pass';

  const result = runelric(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    `--testPathPattern=${testPathPattern}`,
  ]);

  expect(result.stdout).toBe(testPathPattern);
});

test('globalTeardown throws with named export', () => {
  const teardownPath = path.resolve(
    e2eDir,
    'invalidTeardownWithNamedExport.js',
  );

  const {exitCode, stderr} = runelric(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    `--testPathPattern=__tests__`,
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('elric: Got error running globalTeardown');
  expect(stderr).toContain(
    `globalTeardown file must export a function at ${teardownPath}`,
  );
});

onNodeVersions('>=12.17.0', () => {
  test('globalTeardown works with ESM modules', () => {
    const {exitCode} = runelric('global-teardown-esm', [`--no-cache`], {
      nodeOptions: '--experimental-vm-modules --no-warnings',
    });

    expect(exitCode).toBe(0);
  });
});
