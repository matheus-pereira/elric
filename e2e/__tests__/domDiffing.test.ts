/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {replaceTime} from '../Utils';
import runelric from '../runelric';

test('should work without error', () => {
  const output = runelric('dom-diffing');
  expect(output.failed).toBe(true);
  expect(replaceTime(output.stderr)).toMatchSnapshot();
});
