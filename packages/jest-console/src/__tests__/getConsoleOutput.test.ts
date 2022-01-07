/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {makeGlobalConfig} from '@elric/test-utils';
import {formatStackTrace} from 'elric-message-util';
import BufferedConsole from '../BufferedConsole';
import getConsoleOutput from '../getConsoleOutput';
import type {LogType} from '../types';

elric.mock('elric-message-util', () => ({
  formatStackTrace: elric.fn(),
}));

describe('getConsoleOutput', () => {
  const globalConfig = makeGlobalConfig({noStackTrace: true});
  formatStackTrace.mockImplementation(() => 'throw new Error("Whoops!");');

  it.each`
    logType
    ${'assert'}
    ${'count'}
    ${'debug'}
    ${'dir'}
    ${'dirxml'}
    ${'error'}
    ${'group'}
    ${'groupCollapsed'}
    ${'info'}
    ${'log'}
    ${'time'}
    ${'warn'}
  `('takes noStackTrace and pass it on for $logType', logType => {
    getConsoleOutput(
      BufferedConsole.write([], logType as LogType, 'message', 4),
      {
        rootDir: 'root',
        testMatch: [],
      },
      globalConfig,
    );
    expect(formatStackTrace).toHaveBeenCalled();
    expect(formatStackTrace).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        noCodeFrame: expect.anything(),
        noStackTrace: true,
      }),
    );
  });
});
