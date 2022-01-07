/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getConfig} from '../runelric';

test('reads config from cjs file', () => {
  const {configs} = getConfig(
    'config-override',
    ['--config', 'different-config.json'],
    {
      skipPkgJsonCheck: true,
    },
  );

  expect(configs).toHaveLength(1);
  expect(configs[0].displayName).toEqual({
    color: 'white',
    name: 'Config from different-config.json file',
  });
});
