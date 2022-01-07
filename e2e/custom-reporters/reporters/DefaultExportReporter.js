/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO: use babel to transpile actual import/export in elric 26
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _reporters = require('@elric/reporters');

class TestReporter extends _reporters.BaseReporter {
  onTestStart() {
    console.log('test start');
  }

  onTestResult() {
    console.log('test complete');
  }

  onRunStart() {
    console.log('run start');
  }

  onRunComplete() {
    console.log('run complete');
  }
}

exports.default = TestReporter;
