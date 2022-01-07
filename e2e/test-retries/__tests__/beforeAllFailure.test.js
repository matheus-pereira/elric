/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

elric.retryTimes(3);

beforeAll(() => {
  throw new Error('Failure in beforeAll');
});

it('should not be retried because hook failure occurred', () => {
  throw new Error('should not be invoked');
});
