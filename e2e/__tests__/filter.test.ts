/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

describe('Dynamic test filtering', () => {
  it('uses the default JSON option', () => {
    const result = runelric('filter', []);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('1 total');
  });

  it('uses the CLI option', () => {
    const result = runelric('filter', [
      '--filter=<rootDir>/my-secondary-filter.js',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('1 total');
  });

  it('ignores the filter if requested to do so', () => {
    const result = runelric('filter', [
      '--filter=<rootDir>/my-secondary-filter.js',
      '--skipFilter',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('2 total');
  });

  it('throws when you return clowny stuff', () => {
    const result = runelric('filter', [
      '--filter=<rootDir>/my-clowny-filter.js',
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('did not return a valid test list');
    expect(result.stderr).toContain('my-clowny-filter');
  });

  it('will call setup on filter before filtering', () => {
    const result = runelric('filter', ['--filter=<rootDir>/my-setup-filter.js']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('1 total');
  });

  it('will print error when filter throws', () => {
    const result = runelric('filter', [
      '--filter=<rootDir>/my-broken-filter.js',
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Error: My broken filter error.');
  });

  it('will return no results when setup hook throws', () => {
    const result = runelric('filter', [
      '--filter=<rootDir>/my-broken-setup-filter.js',
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Error: My broken setup filter error.');
  });
});
