/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

test('works with custom inline snapshot matchers', () => {
  const {stderr} = runelric('custom-inline-snapshot-matchers', [
    // Prevent adding new snapshots or rather changing the test.
    '--ci',
    'asynchronous.test.js',
  ]);

  let {rest} = extractSummary(stderr);

  rest = rest
    .split('\n')
    .filter(line => line.indexOf('at Error (native)') < 0)
    .join('\n');

  expect(wrap(rest)).toMatchSnapshot();
});

test('can bail with a custom inline snapshot matcher', () => {
  const {stderr} = runelric('custom-inline-snapshot-matchers', [
    // Prevent adding new snapshots or rather changing the test.
    '--ci',
    'bail.test.js',
  ]);

  let {rest} = extractSummary(stderr);

  rest = rest
    .split('\n')
    .filter(line => line.indexOf('at Error (native)') < 0)
    .join('\n');

  expect(wrap(rest)).toMatchSnapshot();
});
