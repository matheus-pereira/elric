/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable elric/no-focused-tests */

import semver = require('semver');

export function iselricJasmineRun(): boolean {
  return process.env.elric_JASMINE === '1';
}

export function skipSuiteOnJasmine(): void {
  if (iselricJasmineRun()) {
    test.only('does not work on Jasmine', () => {
      console.warn('[SKIP] Does not work on Jasmine');
    });
  }
}

export function skipSuiteOnelricCircus(): void {
  if (!iselricJasmineRun()) {
    test.only('does not work on elric-circus', () => {
      console.warn('[SKIP] Does not work on elric-circus');
    });
  }
}

export function onNodeVersions(
  versionRange: string,
  testBody: () => void,
): void {
  const description = `on node ${versionRange}`;
  if (semver.satisfies(process.versions.node, versionRange)) {
    describe(description, () => {
      testBody();
    });
  } else {
    describe.skip(description, () => {
      testBody();
    });
  }
}
