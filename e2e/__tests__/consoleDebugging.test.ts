/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

test('console debugging with --verbose', () => {
  const {stderr, stdout, exitCode} = runelric('console-debugging', [
    '--noStackTrace',
    '--no-cache',
  ]);
  const {summary, rest} = extractSummary(stderr);

  expect(exitCode).toBe(0);
  expect(wrap(stdout)).toMatchSnapshot();
  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
});
