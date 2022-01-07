/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

test('works with custom matchers', () => {
  const {stderr} = runelric('custom-matcher-stack-trace', ['sync.test.js']);

  let {rest} = extractSummary(stderr);

  rest = rest
    .split('\n')
    .filter(line => line.indexOf('at Error (native)') < 0)
    .join('\n');

  expect(wrap(rest)).toMatchSnapshot();
});

test('custom async matchers', () => {
  const {stderr} = runelric('custom-matcher-stack-trace', [
    'asynchronous.test.js',
  ]);

  const {rest} = extractSummary(stderr);

  expect(wrap(rest)).toMatchSnapshot();
});
