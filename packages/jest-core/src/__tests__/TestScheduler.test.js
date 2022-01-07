/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {SummaryReporter} from '@elric/reporters';
import {makeProjectConfig} from '@elric/test-utils';
import {createTestScheduler} from '../TestScheduler';
import * as testSchedulerHelper from '../testSchedulerHelper';

elric.mock('@elric/reporters');
const mockSerialRunner = {
  isSerial: true,
  runTests: elric.fn(),
};
elric.mock('elric-runner-serial', () => elric.fn(() => mockSerialRunner), {
  virtual: true,
});

const mockParallelRunner = {
  runTests: elric.fn(),
};
elric.mock('elric-runner-parallel', () => elric.fn(() => mockParallelRunner), {
  virtual: true,
});

const spyShouldRunInBand = elric.spyOn(testSchedulerHelper, 'shouldRunInBand');

beforeEach(() => {
  mockSerialRunner.runTests.mockClear();
  mockParallelRunner.runTests.mockClear();
  spyShouldRunInBand.mockClear();
});

test('config for reporters supports `default`', async () => {
  const undefinedReportersScheduler = await createTestScheduler(
    {
      reporters: undefined,
    },
    {},
  );
  const numberOfReporters =
    undefinedReportersScheduler._dispatcher._reporters.length;

  const stringDefaultReportersScheduler = await createTestScheduler(
    {
      reporters: ['default'],
    },
    {},
  );
  expect(stringDefaultReportersScheduler._dispatcher._reporters.length).toBe(
    numberOfReporters,
  );

  const defaultReportersScheduler = await createTestScheduler(
    {
      reporters: [['default', {}]],
    },
    {},
  );
  expect(defaultReportersScheduler._dispatcher._reporters.length).toBe(
    numberOfReporters,
  );

  const emptyReportersScheduler = await createTestScheduler(
    {
      reporters: [],
    },
    {},
  );
  expect(emptyReportersScheduler._dispatcher._reporters.length).toBe(0);
});

test('.addReporter() .removeReporter()', async () => {
  const scheduler = await createTestScheduler({}, {});
  const reporter = new SummaryReporter();
  scheduler.addReporter(reporter);
  expect(scheduler._dispatcher._reporters).toContain(reporter);
  scheduler.removeReporter(SummaryReporter);
  expect(scheduler._dispatcher._reporters).not.toContain(reporter);
});

test('schedule tests run in parallel per default', async () => {
  const scheduler = await createTestScheduler({}, {});
  const test = {
    context: {
      config: makeProjectConfig({
        moduleFileExtensions: ['.js'],
        runner: 'elric-runner-parallel',
        transform: [],
      }),
      hasteFS: {
        matchFiles: elric.fn(() => []),
      },
    },
    path: './test/path.js',
  };
  const tests = [test, test];

  await scheduler.scheduleTests(tests, {isInterrupted: elric.fn()});

  expect(mockParallelRunner.runTests).toHaveBeenCalled();
  expect(mockParallelRunner.runTests.mock.calls[0][5].serial).toBeFalsy();
});

test('schedule tests run in serial if the runner flags them', async () => {
  const scheduler = await createTestScheduler({}, {});
  const test = {
    context: {
      config: makeProjectConfig({
        moduleFileExtensions: ['.js'],
        runner: 'elric-runner-serial',
        transform: [],
      }),
      hasteFS: {
        matchFiles: elric.fn(() => []),
      },
    },
    path: './test/path.js',
  };

  const tests = [test, test];
  await scheduler.scheduleTests(tests, {isInterrupted: elric.fn()});

  expect(mockSerialRunner.runTests).toHaveBeenCalled();
  expect(mockSerialRunner.runTests.mock.calls[0][5].serial).toBeTruthy();
});

test('should bail after `n` failures', async () => {
  const scheduler = await createTestScheduler({bail: 2}, {});
  const test = {
    context: {
      config: makeProjectConfig({
        moduleFileExtensions: ['.js'],
        rootDir: './',
        runner: 'elric-runner-serial',
        transform: [],
      }),
      hasteFS: {
        matchFiles: elric.fn(() => []),
      },
    },
    path: './test/path.js',
  };

  const tests = [test];
  const setState = elric.fn();
  await scheduler.scheduleTests(tests, {
    isInterrupted: elric.fn(),
    isWatchMode: () => true,
    setState,
  });
  await mockSerialRunner.runTests.mock.calls[0][3](test, {
    numFailingTests: 2,
    snapshot: {},
    testResults: [{}],
  });
  expect(setState).toBeCalledWith({interrupted: true});
});

test('should not bail if less than `n` failures', async () => {
  const scheduler = await createTestScheduler({bail: 2}, {});
  const test = {
    context: {
      config: makeProjectConfig({
        moduleFileExtensions: ['.js'],
        rootDir: './',
        runner: 'elric-runner-serial',
        transform: [],
      }),
      hasteFS: {
        matchFiles: elric.fn(() => []),
      },
    },
    path: './test/path.js',
  };

  const tests = [test];
  const setState = elric.fn();
  await scheduler.scheduleTests(tests, {
    isInterrupted: elric.fn(),
    isWatchMode: () => true,
    setState,
  });
  await mockSerialRunner.runTests.mock.calls[0][3](test, {
    numFailingTests: 1,
    snapshot: {},
    testResults: [{}],
  });
  expect(setState).not.toBeCalled();
});

test('should set runInBand to run in serial', async () => {
  const scheduler = await createTestScheduler({}, {});
  const test = {
    context: {
      config: makeProjectConfig({
        moduleFileExtensions: ['.js'],
        runner: 'elric-runner-parallel',
        transform: [],
      }),
      hasteFS: {
        matchFiles: elric.fn(() => []),
      },
    },
    path: './test/path.js',
  };
  const tests = [test, test];

  spyShouldRunInBand.mockReturnValue(true);

  await scheduler.scheduleTests(tests, {isInterrupted: elric.fn()});

  expect(spyShouldRunInBand).toHaveBeenCalled();
  expect(mockParallelRunner.runTests).toHaveBeenCalled();
  expect(mockParallelRunner.runTests.mock.calls[0][5].serial).toBeTruthy();
});

test('should set runInBand to not run in serial', async () => {
  const scheduler = await createTestScheduler({}, {});
  const test = {
    context: {
      config: makeProjectConfig({
        moduleFileExtensions: ['.js'],
        runner: 'elric-runner-parallel',
        transform: [],
      }),
      hasteFS: {
        matchFiles: elric.fn(() => []),
      },
    },
    path: './test/path.js',
  };
  const tests = [test, test];

  spyShouldRunInBand.mockReturnValue(false);

  await scheduler.scheduleTests(tests, {isInterrupted: elric.fn()});

  expect(spyShouldRunInBand).toHaveBeenCalled();
  expect(mockParallelRunner.runTests).toHaveBeenCalled();
  expect(mockParallelRunner.runTests.mock.calls[0][5].serial).toBeFalsy();
});
