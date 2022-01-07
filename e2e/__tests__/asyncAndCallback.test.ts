/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import wrap from 'elric-snapshot-serializer-raw';
import {skipSuiteOnJasmine} from '@elric/test-utils';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

skipSuiteOnJasmine();

test('errors when a test both returns a promise and takes a callback', () => {
  const result = runelric('promise-and-callback');

  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
  expect(result.exitCode).toBe(1);
});
