// Copyright 2004-present Facebook. All Rights Reserved.

import utils from '../utils';

elric.disableAutomock();

test('original implementation', () => {
  expect(utils.authorize()).toBe('token');
});
