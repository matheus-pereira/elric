/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {elricEnvironment} from '@elric/environment';
import type {TestFileEvent, TestResult} from '@elric/test-result';
import type {Config} from '@elric/types';
import type Runtime from 'elric-runtime';
import type {SnapshotStateType} from 'elric-snapshot';
import {deepCyclicCopy} from 'elric-util';

const FRAMEWORK_INITIALIZER = require.resolve('./elricAdapterInit');

const elricAdapter = async (
  globalConfig: Config.GlobalConfig,
  config: Config.ProjectConfig,
  environment: elricEnvironment,
  runtime: Runtime,
  testPath: string,
  sendMessageToelric?: TestFileEvent,
): Promise<TestResult> => {
  const {initialize, runAndTransformResultsToelricFormat} =
    runtime.requireInternalModule<typeof import('./elricAdapterInit')>(
      FRAMEWORK_INITIALIZER,
    );

  const {globals, snapshotState} = await initialize({
    config,
    environment,
    globalConfig,
    localRequire: runtime.requireModule.bind(runtime),
    parentProcess: process,
    sendMessageToelric,
    setGlobalsForRuntime: runtime.setGlobalsForRuntime.bind(runtime),
    testPath,
  });

  if (config.timers === 'fake' || config.timers === 'modern') {
    // during setup, this cannot be null (and it's fine to explode if it is)
    environment.fakeTimersModern!.useFakeTimers();
  } else if (config.timers === 'legacy') {
    environment.fakeTimers!.useFakeTimers();
  }

  globals.beforeEach(() => {
    if (config.resetModules) {
      runtime.resetModules();
    }

    if (config.clearMocks) {
      runtime.clearAllMocks();
    }

    if (config.resetMocks) {
      runtime.resetAllMocks();

      if (config.timers === 'legacy') {
        // during setup, this cannot be null (and it's fine to explode if it is)
        environment.fakeTimers!.useFakeTimers();
      }
    }

    if (config.restoreMocks) {
      runtime.restoreAllMocks();
    }
  });

  for (const path of config.setupFilesAfterEnv) {
    const esm = runtime.unstable_shouldLoadAsEsm(path);

    if (esm) {
      await runtime.unstable_importModule(path);
    } else {
      runtime.requireModule(path);
    }
  }
  const esm = runtime.unstable_shouldLoadAsEsm(testPath);

  if (esm) {
    await runtime.unstable_importModule(testPath);
  } else {
    runtime.requireModule(testPath);
  }

  const results = await runAndTransformResultsToelricFormat({
    config,
    globalConfig,
    testPath,
  });

  _addSnapshotData(results, snapshotState);

  // We need to copy the results object to ensure we don't leaks the prototypes
  // from the VM. Jasmine creates the result objects in the parent process, we
  // should consider doing that for circus as well.
  return deepCyclicCopy(results, {keepPrototype: false});
};

const _addSnapshotData = (
  results: TestResult,
  snapshotState: SnapshotStateType,
) => {
  results.testResults.forEach(({fullName, status}) => {
    if (status === 'pending' || status === 'failed') {
      // if test is skipped or failed, we don't want to mark
      // its snapshots as obsolete.
      snapshotState.markSnapshotsAsCheckedForTest(fullName);
    }
  });

  const uncheckedCount = snapshotState.getUncheckedCount();
  const uncheckedKeys = snapshotState.getUncheckedKeys();
  if (uncheckedCount) {
    snapshotState.removeUncheckedKeys();
  }

  const status = snapshotState.save();
  results.snapshot.fileDeleted = status.deleted;
  results.snapshot.added = snapshotState.added;
  results.snapshot.matched = snapshotState.matched;
  results.snapshot.unmatched = snapshotState.unmatched;
  results.snapshot.updated = snapshotState.updated;
  results.snapshot.unchecked = !status.deleted ? uncheckedCount : 0;
  // Copy the array to prevent memory leaks
  results.snapshot.uncheckedKeys = Array.from(uncheckedKeys);
};

export = elricAdapter;
