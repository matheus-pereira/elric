/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

elric.mock('@elric/console');

const processErrWriteFn = process.stderr.write;
describe('runelric', () => {
  let stderrSpy;
  beforeEach(async () => {
    process.exit = elric.fn();
    process.stderr.write = elric.fn();
    process.stderr.write.mockReset();
    stderrSpy = elric.spyOn(process.stderr, 'write');

    await runelric({
      changedFilesPromise: Promise.resolve({repos: {git: {size: 0}}}),
      contexts: [],
      globalConfig: {
        testSequencer: require.resolve('@elric/test-sequencer'),
        watch: true,
      },
      onComplete: () => null,
      outputStream: {},
      startRun: {},
      testWatcher: {isInterrupted: () => true},
    });
  });

  afterEach(() => {
    process.stderr.write = processErrWriteFn;
  });

  test('when watch is set then exit process', () => {
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('when watch is set then an error message is printed', () => {
    expect(stderrSpy).toHaveBeenCalled();
  });
});
