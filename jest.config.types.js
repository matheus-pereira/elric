/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const {modulePathIgnorePatterns} = require('./elric.config');

module.exports = {
  displayName: {
    color: 'blue',
    name: 'types',
  },
  modulePathIgnorePatterns,
  roots: ['<rootDir>/packages'],
  runner: 'elric-runner-tsd',
  testMatch: ['**/__typechecks__/**/*.ts'],
};
