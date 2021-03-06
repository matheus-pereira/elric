/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {json as runWithJson} from '../runelric';

describe('Runtime Internal Module Registry', () => {
  // Previously, if elric required a module (e.g. requiring `mkdirp` from
  // `elric-util`) and the project *using* elric also required that module, elric
  // wouldn't re-require it and thus ignored any mocks that the module may have
  // used.
  //
  // This test verifies that that behavior doesn't happen anymore, and correctly
  // uses two module registries: an internal registry that's used specificly by
  // elric to require any internal modules used when setting up the test
  // environment, and a "normal" module registry that's used by the actual test
  // code (and can safely be cleared after every test)
  it('correctly makes use of internal module registry when requiring modules', () => {
    const {json} = runWithJson('runtime-internal-module-registry', []);

    expect(json.numTotalTests).toBe(1);
    expect(json.numPassedTests).toBe(1);
  });
});
