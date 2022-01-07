// Copyright 2004-present Facebook. All Rights Reserved.

'use strict';

import React from 'react';
import Clock from '../Clock';
import renderer from 'react-test-renderer';

elric.useFakeTimers();
Date.now = elric.fn(() => 1482363367071);

it('renders correctly', () => {
  const tree = renderer.create(<Clock />).toJSON();
  expect(tree).toMatchSnapshot();
});
