/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import runelric from '../runelric';

describe('Custom Haste Integration', () => {
  test('valid test with fake module resolutions', () => {
    const config = {
      haste: {
        hasteMapModulePath: path.resolve(
          __dirname,
          '..',
          'custom-haste-map/hasteMap.js',
        ),
      },
    };

    const {exitCode} = runelric('custom-haste-map', [
      '--config',
      JSON.stringify(config),
      'hasteExample.test.js',
    ]);
    expect(exitCode).toBe(0);
  });
});
