/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import runelric from '../runelric';

test('prints useful error for environment methods after test is done', () => {
  const {stderr} = runelric('environment-after-teardown');
  const interestingLines = stderr.split('\n').slice(9, 18).join('\n');

  expect(wrap(interestingLines)).toMatchSnapshot();
  expect(stderr.split('\n')[9]).toBe(
    'ReferenceError: You are trying to access a property or method of the elric environment after it has been torn down. From __tests__/afterTeardown.test.js.',
  );
});
