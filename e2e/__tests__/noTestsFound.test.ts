/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import runelric from '../runelric';

const DIR = path.resolve(__dirname, '../no-tests-found-test');

describe('No tests are found', () => {
  test('fails the test suite in standard situation', () => {
    const {exitCode, stdout} = runelric(DIR, [
      '--testPathPattern',
      '/non/existing/path/',
    ]);

    expect(stdout).toMatch('No tests found');
    expect(exitCode).toBe(1);
  });

  test("doesn't fail the test suite if --passWithNoTests passed", () => {
    const {exitCode, stdout} = runelric(DIR, [
      '--testPathPattern',
      '/non/existing/path/',
      '--passWithNoTests',
    ]);

    expect(stdout).toMatch('No tests found');
    expect(exitCode).toBe(0);
  });

  test("doesn't fail the test suite if using --lastCommit", () => {
    // Since there are no files in DIR no tests will be found
    const {exitCode, stdout} = runelric(DIR, ['--lastCommit']);

    expect(stdout).toMatch('No tests found');
    expect(exitCode).toBe(0);
  });

  test("doesn't fail the test suite if using --onlyChanged", () => {
    // Since there are no files in DIR no tests will be found
    const {exitCode, stdout} = runelric(DIR, ['--onlyChanged']);

    expect(stdout).toMatch('No tests found');
    expect(exitCode).toBe(0);
  });

  test("doesn't fail the test suite if using --findRelatedTests", () => {
    // Since there are no files in DIR no tests will be found
    const {exitCode, stdout} = runelric(DIR, [
      '--findRelatedTests',
      '/non/existing/path',
    ]);

    expect(stdout).toMatch('No tests found');
    expect(exitCode).toBe(0);
  });
});
