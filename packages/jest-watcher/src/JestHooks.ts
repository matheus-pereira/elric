/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  FileChange,
  elricHookEmitter,
  elricHookSubscriber,
  ShouldRunTestSuite,
  TestRunComplete,
} from './types';

type AvailableHooks =
  | 'onFileChange'
  | 'onTestRunComplete'
  | 'shouldRunTestSuite';

class elricHooks {
  private _listeners: {
    onFileChange: Array<FileChange>;
    onTestRunComplete: Array<TestRunComplete>;
    shouldRunTestSuite: Array<ShouldRunTestSuite>;
  };

  private _subscriber: elricHookSubscriber;
  private _emitter: elricHookEmitter;

  constructor() {
    this._listeners = {
      onFileChange: [],
      onTestRunComplete: [],
      shouldRunTestSuite: [],
    };

    this._subscriber = {
      onFileChange: fn => {
        this._listeners.onFileChange.push(fn);
      },
      onTestRunComplete: fn => {
        this._listeners.onTestRunComplete.push(fn);
      },
      shouldRunTestSuite: fn => {
        this._listeners.shouldRunTestSuite.push(fn);
      },
    };

    this._emitter = {
      onFileChange: fs =>
        this._listeners.onFileChange.forEach(listener => listener(fs)),
      onTestRunComplete: results =>
        this._listeners.onTestRunComplete.forEach(listener =>
          listener(results),
        ),
      shouldRunTestSuite: async testSuiteInfo => {
        const result = await Promise.all(
          this._listeners.shouldRunTestSuite.map(listener =>
            listener(testSuiteInfo),
          ),
        );

        return result.every(Boolean);
      },
    };
  }

  isUsed(hook: AvailableHooks): boolean {
    return this._listeners[hook]?.length > 0;
  }

  getSubscriber(): Readonly<elricHookSubscriber> {
    return this._subscriber;
  }

  getEmitter(): Readonly<elricHookEmitter> {
    return this._emitter;
  }
}

export default elricHooks;
