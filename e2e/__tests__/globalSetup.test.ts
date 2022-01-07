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
import {
  cleanup,
  createEmptyPackage,
  runYarnInstall,
  writeFiles,
} from '../Utils';
import runelric, {json as runWithJson} from '../runelric';

const DIR = path.join(tmpdir(), 'elric-global-setup');
const project1DIR = path.join(tmpdir(), 'elric-global-setup-project-1');
const project2DIR = path.join(tmpdir(), 'elric-global-setup-project-2');
const customTransformDIR = path.join(
  tmpdir(),
  'elric-global-setup-custom-transform',
);
const nodeModulesDIR = path.join(tmpdir(), 'elric-global-setup-node-modules');
const rejectionDir = path.join(tmpdir(), 'elric-global-setup-rejection');
const e2eDir = path.resolve(__dirname, '../global-setup');
const esmTmpDir = path.join(tmpdir(), 'elric-global-setup-esm');

beforeAll(() => {
  runYarnInstall(e2eDir);
});

beforeEach(() => {
  cleanup(DIR);
  cleanup(project1DIR);
  cleanup(project2DIR);
  cleanup(customTransformDIR);
  cleanup(nodeModulesDIR);
  cleanup(rejectionDir);
  cleanup(esmTmpDir);
});

afterAll(() => {
  cleanup(DIR);
  cleanup(project1DIR);
  cleanup(project2DIR);
  cleanup(customTransformDIR);
  cleanup(nodeModulesDIR);
  cleanup(rejectionDir);
  cleanup(esmTmpDir);
});

test('globalSetup is triggered once before all test suites', () => {
  const setupPath = path.join(e2eDir, 'setup.js');
  const result = runWithJson(e2eDir, [
    `--globalSetup=${setupPath}`,
    `--testPathPattern=__tests__`,
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
});

test('elric throws an error when globalSetup does not export a function', () => {
  const setupPath = path.resolve(__dirname, '../global-setup/invalidSetup.js');
  const {exitCode, stderr} = runelric(e2eDir, [
    `--globalSetup=${setupPath}`,
    `--testPathPattern=__tests__`,
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('elric: Got error running globalSetup');
  expect(stderr).toContain(
    `globalSetup file must export a function at ${setupPath}`,
  );
});

test('globalSetup function gets elric config object as a parameter', () => {
  const setupPath = path.resolve(e2eDir, 'setupWithConfig.js');

  const testPathPattern = 'pass';

  const result = runelric(e2eDir, [
    `--globalSetup=${setupPath}`,
    `--testPathPattern=${testPathPattern}`,
  ]);

  expect(result.stdout).toBe(testPathPattern);
});

test('should call globalSetup function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.elric.config.js');

  const result = runWithJson(e2eDir, [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
});

test('should not call a globalSetup of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.elric.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    '--testPathPattern=project-1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
});

test('should not call any globalSetup if there are no tests to run', () => {
  const configPath = path.resolve(e2eDir, 'projects.elric.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    // onlyChanged ensures there are no tests to run
    '--onlyChanged',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(false);
  expect(fs.existsSync(project1DIR)).toBe(false);
  expect(fs.existsSync(project2DIR)).toBe(false);
});

test('globalSetup works with default export', () => {
  const setupPath = path.resolve(e2eDir, 'setupWithDefaultExport.js');

  const testPathPattern = 'pass';

  const result = runelric(e2eDir, [
    `--globalSetup=${setupPath}`,
    `--testPathPattern=${testPathPattern}`,
  ]);

  expect(result.stdout).toBe(testPathPattern);
});

test('globalSetup throws with named export', () => {
  const setupPath = path.resolve(e2eDir, 'invalidSetupWithNamedExport.js');

  const {exitCode, stderr} = runelric(e2eDir, [
    `--globalSetup=${setupPath}`,
    `--testPathPattern=__tests__`,
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('elric: Got error running globalSetup');
  expect(stderr).toContain(
    `globalSetup file must export a function at ${setupPath}`,
  );
});

test('should not transpile the transformer', () => {
  const {exitCode} = runelric('global-setup-custom-transform', [`--no-cache`]);

  expect(exitCode).toBe(0);
});

test('should transform node_modules if configured by transformIgnorePatterns', () => {
  const {exitCode} = runelric('global-setup-node-modules', [`--no-cache`]);

  expect(exitCode).toBe(0);
});

test('properly handle rejections', () => {
  createEmptyPackage(rejectionDir, {elric: {globalSetup: '<rootDir>/setup.js'}});
  writeFiles(rejectionDir, {
    'setup.js': `
      module.exports = () => Promise.reject();
    `,
    'test.js': `
      test('dummy', () => {
        expect(true).toBe(true);
      });
    `,
  });

  const {exitCode, stderr} = runelric(rejectionDir, [`--no-cache`]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Error: elric: Got error running globalSetup');
  expect(stderr).toContain('reason: undefined');
});

onNodeVersions('>=12.17.0', () => {
  test('globalSetup works with ESM modules', () => {
    const {exitCode} = runelric('global-setup-esm', [`--no-cache`], {
      nodeOptions: '--experimental-vm-modules --no-warnings',
    });

    expect(exitCode).toBe(0);
  });
});
