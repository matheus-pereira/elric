/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {onNodeVersions} from '@elric/test-utils';
import {extractSummary} from '../Utils';
import runelric from '../runelric';
const dir = path.resolve(__dirname, '../custom-esm-test-sequencer');

onNodeVersions('>=12.16.0', () => {
  test('run prioritySequence', () => {
    const result = runelric(dir, ['-i'], {
      nodeOptions: '--experimental-vm-modules --no-warnings',
    });

    expect(result.exitCode).toBe(0);
    const sequence = extractSummary(result.stderr)
      .rest.replace(/PASS /g, '')
      .split('\n');
    expect(sequence).toEqual([
      './a.test.js',
      './b.test.js',
      './c.test.js',
      './d.test.js',
      './e.test.js',
    ]);
  });
});
