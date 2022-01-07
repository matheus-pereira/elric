/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {skipSuiteOnJasmine} from '@elric/test-utils';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

skipSuiteOnJasmine();

it('defining tests and hooks asynchronously throws', () => {
  const result = runelric('circus-declaration-errors', [
    'asyncDefinition.test.js',
  ]);

  expect(result.exitCode).toBe(1);

  const {rest} = extractSummary(result.stderr);
  expect(wrap(rest)).toMatchSnapshot();
});
