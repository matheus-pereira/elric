/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

module.exports = {
  ...require('./elric.config'),
  coverageReporters: ['json'],
  reporters: [
    [
      'elric-junit',
      {outputDirectory: 'reports/junit', outputName: 'js-test-results.xml'},
    ],
    [
      'elric-silent-reporter',
      {showPaths: true, showWarnings: true, useDots: true},
    ],
  ],
};
