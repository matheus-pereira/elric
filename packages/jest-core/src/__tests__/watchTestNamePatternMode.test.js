/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import chalk from 'chalk';
import wrap from 'elric-snapshot-serializer-raw';
// eslint-disable-next-line import/order
import {KEYS} from 'elric-watcher';

const runelricMock = elric.fn();

elric
  .mock('ansi-escapes', () => ({
    cursorDown: (count = 1) => `[MOCK - cursorDown(${count})]`,
    cursorHide: '[MOCK - cursorHide]',
    cursorRestorePosition: '[MOCK - cursorRestorePosition]',
    cursorSavePosition: '[MOCK - cursorSavePosition]',
    cursorShow: '[MOCK - cursorShow]',
    cursorTo: (x, y) => `[MOCK - cursorTo(${x}, ${y})]`,
  }))
  .mock('elric-util', () => {
    const {specialChars, ...util} = elric.requireActual('elric-util');
    return {
      ...util,
      specialChars: {...specialChars, CLEAR: '[MOCK - clear]'},
    };
  });

elric.mock(
  '../SearchSource',
  () =>
    class {
      findMatchingTests(pattern) {
        return {paths: []};
      }
    },
);

elric.doMock('chalk', () => new chalk.Instance({level: 0}));

elric.doMock('strip-ansi');
require('strip-ansi').mockImplementation(str => str);

elric.doMock(
  '../runelric',
  () =>
    function () {
      const args = Array.from(arguments);
      const [{onComplete}] = args;
      runelricMock.apply(null, args);

      // Call the callback
      onComplete({
        snapshot: {},
        testResults: [
          {
            testResults: [{title: 'should return the correct index when'}],
          },
          {
            testResults: [{title: 'should allow test siblings to modify'}],
          },
          {
            testResults: [{title: 'might get confusing'}],
          },
          {
            testResults: [
              {title: 'should handle length properties that cannot'},
            ],
          },
          {
            testResults: [{title: 'should recognize various types'}],
          },
          {
            testResults: [{title: 'should recognize null and undefined'}],
          },
          {
            testResults: [{title: 'should not output colors to pipe'}],
          },
          {
            testResults: [{title: 'should convert string to a RegExp'}],
          },
          {
            testResults: [
              {title: 'should escape and convert string to a RegExp'},
            ],
          },
          {
            testResults: [{title: 'should convert grep string to a RegExp'}],
          },
        ],
      });

      return Promise.resolve();
    },
);

const watch = require('../watch').default;

const globalConfig = {
  watch: true,
};

afterEach(runelricMock.mockReset);

describe('Watch mode flows', () => {
  let pipe;
  let hasteMapInstances;
  let contexts;
  let stdin;

  beforeEach(() => {
    pipe = {write: elric.fn()};
    hasteMapInstances = [{on: () => {}}];
    contexts = [{config: {}}];
    stdin = new MockStdin();
  });

  it('Pressing "T" enters pattern mode', () => {
    contexts[0].config = {rootDir: ''};
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);

    // Write a enter pattern mode
    stdin.emit('t');
    expect(pipe.write).toBeCalledWith(' pattern › ');

    const assertPattern = hex => {
      pipe.write.mockReset();
      stdin.emit(hex);
      expect(wrap(pipe.write.mock.calls.join('\n'))).toMatchSnapshot();
    };

    // Write a pattern
    ['c', 'o', 'n', ' ', '1', '2'].forEach(assertPattern);

    [KEYS.BACKSPACE, KEYS.BACKSPACE].forEach(assertPattern);

    ['*'].forEach(assertPattern);

    // Runs elric again
    runelricMock.mockReset();
    stdin.emit(KEYS.ENTER);
    expect(runelricMock).toBeCalled();

    // globalConfig is updated with the current pattern
    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      onlyChanged: false,
      testNamePattern: 'con *',
      watch: true,
      watchAll: false,
    });
  });
});

class MockStdin {
  constructor() {
    this._callbacks = [];
  }

  setRawMode() {}

  resume() {}

  setEncoding() {}

  on(evt, callback) {
    this._callbacks.push(callback);
  }

  emit(key) {
    this._callbacks.forEach(cb => cb(key));
  }
}
