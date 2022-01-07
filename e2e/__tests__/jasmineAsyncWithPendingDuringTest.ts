/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {skipSuiteOnelricCircus} from '@elric/test-utils';
import {json as runWithJson} from '../runelric';

describe('async jasmine with pending during test', () => {
  skipSuiteOnelricCircus();

  it('should be reported as a pending test', () => {
    const {json} = runWithJson('jasmine-async', ['pendingInPromise.test.js']);

    expect(json.numTotalTests).toBe(1);
    expect(json.numPassedTests).toBe(0);
    expect(json.numFailedTests).toBe(0);
    expect(json.numPendingTests).toBe(1);
  });
});
