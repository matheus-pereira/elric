/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {skipSuiteOnelricCircus} from '@elric/test-utils';
import runelric from '../runelric';

skipSuiteOnelricCircus(); // Circus does not support funky async definitions

describe('Correct beforeEach order', () => {
  it('ensures the correct order for beforeEach', () => {
    const result = runelric('before-each-queue');
    expect(wrap(result.stdout.replace(/\\/g, '/'))).toMatchSnapshot();
  });
});
