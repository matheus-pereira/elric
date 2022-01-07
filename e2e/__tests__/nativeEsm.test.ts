/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'path';
import wrap from 'elric-snapshot-serializer-raw';
import {onNodeVersions} from '@elric/test-utils';
import {extractSummary} from '../Utils';
import runelric, {getConfig} from '../runelric';

const DIR = resolve(__dirname, '../native-esm');

test('test config is without transform', () => {
  const {configs} = getConfig(DIR);

  expect(configs).toHaveLength(1);
  expect(configs[0].transform).toEqual([]);
});

// The versions where vm.Module exists and commonjs with "exports" is not broken
onNodeVersions('>=12.16.0', () => {
  test('runs test with native ESM', () => {
    const {exitCode, stderr, stdout} = runelric(DIR, ['native-esm.test.js'], {
      nodeOptions: '--experimental-vm-modules --no-warnings',
    });

    const {summary} = extractSummary(stderr);

    expect(wrap(summary)).toMatchSnapshot();
    expect(stdout).toBe('');
    expect(exitCode).toBe(0);
  });
});

// The versions where TLA is supported
onNodeVersions('>=14.3.0', () => {
  test('supports top-level await', () => {
    const {exitCode, stderr, stdout} = runelric(
      DIR,
      ['native-esm.tla.test.js'],
      {nodeOptions: '--experimental-vm-modules --no-warnings'},
    );

    const {summary} = extractSummary(stderr);

    expect(wrap(summary)).toMatchSnapshot();
    expect(stdout).toBe('');
    expect(exitCode).toBe(0);
  });
});
