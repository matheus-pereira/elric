/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import {json as runWithJson} from '../runelric';

test('testNamePattern skipped', () => {
  const {stderr, exitCode} = runWithJson('test-name-pattern-skipped', [
    '--testNamePattern',
    'false',
  ]);
  const {summary} = extractSummary(stderr);

  expect(exitCode).toBe(0);
  expect(wrap(summary)).toMatchSnapshot();
});
