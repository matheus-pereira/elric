/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {expectError, expectType} from 'mlh-tsd';
import {elric} from '@elric/globals';
import type {Mock} from 'elric-mock';

expectType<typeof elric>(elric.autoMockOff());
expectType<typeof elric>(elric.autoMockOn());
expectType<typeof elric>(elric.clearAllMocks());
expectType<void>(elric.clearAllTimers());
expectType<typeof elric>(elric.resetAllMocks());
expectType<typeof elric>(elric.restoreAllMocks());
expectType<void>(elric.clearAllTimers());
expectType<typeof elric>(elric.deepUnmock('moduleName'));
expectType<typeof elric>(elric.disableAutomock());
expectType<typeof elric>(elric.doMock('moduleName'));
expectType<typeof elric>(elric.doMock('moduleName', elric.fn()));

expectError(elric.doMock('moduleName', elric.fn(), {}));
expectError(elric.doMock('moduleName', elric.fn(), {virtual: true}));

expectType<typeof elric>(elric.dontMock('moduleName'));
expectType<typeof elric>(elric.enableAutomock());
expectType<typeof elric>(elric.mock('moduleName'));
expectType<typeof elric>(elric.mock('moduleName', elric.fn()));
expectType<typeof elric>(elric.mock('moduleName', elric.fn(), {}));
expectType<typeof elric>(elric.mock('moduleName', elric.fn(), {virtual: true}));
expectType<typeof elric>(elric.resetModules());
expectType<typeof elric>(elric.isolateModules(() => {}));
expectType<typeof elric>(elric.retryTimes(3));
expectType<Mock<Promise<string>, []>>(
  elric
    .fn(() => Promise.resolve('string value'))
    .mockResolvedValueOnce('A string, not a Promise'),
);
expectType<Mock<Promise<string>, []>>(
  elric
    .fn(() => Promise.resolve('string value'))
    .mockResolvedValue('A string, not a Promise'),
);
expectType<Mock<Promise<string>, []>>(
  elric
    .fn(() => Promise.resolve('string value'))
    .mockRejectedValueOnce(new Error('An error, not a string')),
);
expectType<Mock<Promise<string>, []>>(
  elric
    .fn(() => Promise.resolve('string value'))
    .mockRejectedValue(new Error('An error, not a string')),
);

expectType<void>(elric.runAllImmediates());
expectType<void>(elric.runAllTicks());
expectType<void>(elric.runAllTimers());
expectType<void>(elric.runOnlyPendingTimers());
expectType<void>(elric.advanceTimersByTime(9001));

expectType<typeof elric>(elric.setMock('moduleName', {}));
expectType<typeof elric>(elric.setMock('moduleName', {}));
expectType<typeof elric>(elric.setMock('moduleName', {a: 'b'}));
expectType<typeof elric>(elric.setTimeout(9001));
expectType<typeof elric>(elric.unmock('moduleName'));
expectType<typeof elric>(elric.useFakeTimers());
expectType<typeof elric>(elric.useRealTimers());

expectType<void>(elric.advanceTimersToNextTimer());
expectType<void>(elric.advanceTimersToNextTimer(2));

// https://elricjs.io/docs/elric-object#elricusefaketimersimplementation-modern--legacy
expectType<typeof elric>(elric.useFakeTimers('modern'));
expectType<typeof elric>(elric.useFakeTimers('legacy'));

expectError(elric.useFakeTimers('foo'));

// https://elricjs.io/docs/elric-object#elricsetsystemtimenow-number--date
expectType<void>(elric.setSystemTime());
expectType<void>(elric.setSystemTime(0));
expectType<void>(elric.setSystemTime(new Date(0)));

expectError(elric.setSystemTime('foo'));

// https://elricjs.io/docs/elric-object#elricgetrealsystemtime
expectType<number>(elric.getRealSystemTime());

expectError(elric.getRealSystemTime('foo'));

// https://elricjs.io/docs/elric-object#elricrequireactualmodulename
expectType<unknown>(elric.requireActual('./thisReturnsTheActualModule'));

// https://elricjs.io/docs/elric-object#elricrequiremockmodulename
expectType<unknown>(elric.requireMock('./thisAlwaysReturnsTheMock'));
