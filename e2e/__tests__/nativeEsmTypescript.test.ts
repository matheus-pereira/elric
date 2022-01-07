/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'path';
import {onNodeVersions} from '@elric/test-utils';
import {json as runelric} from '../runelric';

const DIR = resolve(__dirname, '../native-esm-typescript');

// The versions where vm.Module exists and commonjs with "exports" is not broken
onNodeVersions('>=12.16.0', () => {
  test('runs TS test with native ESM', () => {
    const {exitCode, json} = runelric(DIR, [], {
      nodeOptions: '--experimental-vm-modules --no-warnings',
    });

    expect(exitCode).toBe(0);

    expect(json.numTotalTests).toBe(2);
    expect(json.numPassedTests).toBe(2);
  });
});
