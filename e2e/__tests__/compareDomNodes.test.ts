/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('does not crash when expect involving a DOM node fails', () => {
  const result = runelric('compare-dom-nodes');

  expect(result.stderr).toContain('FAIL __tests__/failedAssertion.js');
});
