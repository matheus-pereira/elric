/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import runelric from '../runelric';

test('prints useful error for requires after test is done', () => {
  const {stderr} = runelric('require-after-teardown');

  const interestingLines = stderr.split('\n').slice(9, 18).join('\n');

  expect(wrap(interestingLines)).toMatchSnapshot();
  expect(stderr.split('\n')[19]).toMatch(
    new RegExp('(__tests__/lateRequire.test.js:11:20)'),
  );
});
