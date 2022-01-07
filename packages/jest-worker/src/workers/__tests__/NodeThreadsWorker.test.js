/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import getStream from 'get-stream';
import {
  CHILD_MESSAGE_CALL,
  CHILD_MESSAGE_INITIALIZE,
  PARENT_MESSAGE_CLIENT_ERROR,
  PARENT_MESSAGE_CUSTOM,
  PARENT_MESSAGE_OK,
} from '../../types';

let Worker;
let workerThreads;
let originalExecArgv;

beforeEach(() => {
  elric.mock('worker_threads', () => {
    const fakeClass = elric.fn(() => {
      const EventEmitter = require('events');
      const {PassThrough} = require('stream');

      const thread = new EventEmitter();
      thread.postMessage = elric.fn();
      thread.terminate = elric.fn();
      thread.stdout = new PassThrough();
      thread.stderr = new PassThrough();
      return thread;
    });

    return {
      Worker: fakeClass,
    };
  });
  originalExecArgv = process.execArgv;

  workerThreads = require('worker_threads').Worker;
  workerThreads.postMessage = elric.fn();

  Worker = require('../NodeThreadsWorker').default;
});

afterEach(() => {
  elric.resetModules();
  process.execArgv = originalExecArgv;
});

it('passes fork options down to worker_threads.Worker, adding the defaults', () => {
  const thread = require.resolve('../threadChild');

  // eslint-disable-next-line no-new
  new Worker({
    forkOptions: {
      execArgv: ['--inspect', '-p'],
      execPath: 'hello',
    },
    maxRetries: 3,
    workerData: {
      foo: 'bar',
    },
    workerId: process.env.elric_WORKER_ID - 1,
    workerPath: '/tmp/foo/bar/baz.js',
  });

  expect(workerThreads.mock.calls[0][0]).toBe(thread.replace(/\.ts$/, '.js'));
  expect(workerThreads.mock.calls[0][1]).toEqual({
    eval: false,
    execArgv: ['--inspect', '-p'],
    execPath: 'hello', // Added option.
    resourceLimits: undefined,
    stderr: true,
    stdout: true,
    workerData: {
      // Added option.
      foo: 'bar',
    },
  });
});

it('initializes the thread with the given workerPath and workerId', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    setupArgs: ['foo', 'bar'],
    workerId: 2,
    workerPath: '/tmp/foo/bar/baz.js',
  });

  expect(worker._worker.postMessage.mock.calls[0][0]).toEqual([
    CHILD_MESSAGE_INITIALIZE,
    false,
    '/tmp/foo/bar/baz.js',
    ['foo', 'bar'],
    '3',
  ]);
});

it('stops initializing the worker after the amount of retries is exceeded', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo/bar/baz.js',
  });

  const request = [CHILD_MESSAGE_CALL, false, 'foo', []];
  const onProcessStart = elric.fn();
  const onProcessEnd = elric.fn();

  worker.send(request, onProcessStart, onProcessEnd);

  // We fail four times (initial + three retries).
  worker._worker.emit('exit');
  worker._worker.emit('exit');
  worker._worker.emit('exit');
  worker._worker.emit('exit');

  expect(workerThreads).toHaveBeenCalledTimes(5);
  expect(onProcessStart).toBeCalledWith(worker);
  expect(onProcessEnd).toHaveBeenCalledTimes(1);
  expect(onProcessEnd.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(onProcessEnd.mock.calls[0][0].type).toBe('WorkerError');
  expect(onProcessEnd.mock.calls[0][1]).toBe(null);
});

it('provides stdout and stderr from the threads', async () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  const stdout = worker.getStdout();
  const stderr = worker.getStderr();

  worker._worker.stdout.end('Hello ', 'utf8');
  worker._worker.stderr.end('elric ', 'utf8');
  worker._worker.emit('exit');
  worker._worker.stdout.end('World!', 'utf8');
  worker._worker.stderr.end('Workers!', 'utf8');
  worker._worker.emit('exit', 0);

  await expect(getStream(stdout)).resolves.toEqual('Hello World!');
  await expect(getStream(stderr)).resolves.toEqual('elric Workers!');
});

it('sends the task to the thread', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  const request = [CHILD_MESSAGE_CALL, false, 'foo', []];

  worker.send(
    request,
    () => {},
    () => {},
  );

  // Skipping call "0" because it corresponds to the "initialize" one.
  expect(worker._worker.postMessage.mock.calls[1][0]).toEqual(request);
});

it('resends the task to the thread after a retry', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo/bar/baz.js',
  });

  const request = [CHILD_MESSAGE_CALL, false, 'foo', []];

  worker.send(
    request,
    () => {},
    () => {},
  );

  // Skipping call "0" because it corresponds to the "initialize" one.
  expect(worker._worker.postMessage.mock.calls[1][0]).toEqual(request);

  const previousWorker = worker._worker;
  worker._worker.emit('exit');

  expect(worker._worker).not.toBe(previousWorker);

  // Skipping call "0" because it corresponds to the "initialize" one.
  expect(worker._worker.postMessage.mock.calls[1][0]).toEqual(request);
});

it('calls the onProcessStart method synchronously if the queue is empty', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  const onProcessStart = elric.fn();
  const onProcessEnd = elric.fn();

  worker.send(
    [CHILD_MESSAGE_CALL, false, 'foo', []],
    onProcessStart,
    onProcessEnd,
  );

  // Only onProcessStart has been called
  expect(onProcessStart).toHaveBeenCalledTimes(1);
  expect(onProcessEnd).not.toHaveBeenCalled();

  // then first call replies...
  worker._worker.emit('message', [PARENT_MESSAGE_OK]);

  expect(onProcessEnd).toHaveBeenCalledTimes(1);
});

it('can send multiple messages to parent', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  const onProcessStart = elric.fn();
  const onProcessEnd = elric.fn();
  const onCustomMessage = elric.fn();

  worker.send(
    [CHILD_MESSAGE_CALL, false, 'foo', []],
    onProcessStart,
    onProcessEnd,
    onCustomMessage,
  );

  // Only onProcessStart has been called
  expect(onProcessStart).toHaveBeenCalledTimes(1);
  expect(onProcessEnd).not.toHaveBeenCalled();
  expect(onCustomMessage).not.toHaveBeenCalled();

  // then first call replies...
  worker._worker.emit('message', [
    PARENT_MESSAGE_CUSTOM,
    {message: 'foo bar', otherKey: 1},
  ]);

  expect(onProcessEnd).not.toHaveBeenCalled();
  expect(onCustomMessage).toHaveBeenCalledTimes(1);
  expect(onCustomMessage).toHaveBeenCalledWith({
    message: 'foo bar',
    otherKey: 1,
  });
});

it('creates error instances for known errors', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  const callback1 = elric.fn();
  const callback2 = elric.fn();
  const callback3 = elric.fn();

  // Testing a generic ECMAScript error.
  worker.send([CHILD_MESSAGE_CALL, false, 'method', []], () => {}, callback1);

  worker._worker.emit('message', [
    PARENT_MESSAGE_CLIENT_ERROR,
    'TypeError',
    'bar',
    'TypeError: bar',
    {},
  ]);

  expect(callback1.mock.calls[0][0]).toBeInstanceOf(TypeError);
  expect(callback1.mock.calls[0][0].message).toBe('bar');
  expect(callback1.mock.calls[0][0].type).toBe('TypeError');
  expect(callback1.mock.calls[0][0].stack).toBe('TypeError: bar');

  // Testing a custom error.
  worker.send([CHILD_MESSAGE_CALL, false, 'method', []], () => {}, callback2);

  worker._worker.emit('message', [
    PARENT_MESSAGE_CLIENT_ERROR,
    'RandomCustomError',
    'bar',
    'RandomCustomError: bar',
    {qux: 'extra property'},
  ]);

  expect(callback2.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(callback2.mock.calls[0][0].message).toBe('bar');
  expect(callback2.mock.calls[0][0].type).toBe('RandomCustomError');
  expect(callback2.mock.calls[0][0].stack).toBe('RandomCustomError: bar');
  expect(callback2.mock.calls[0][0].qux).toBe('extra property');

  // Testing a non-object throw.
  worker.send([CHILD_MESSAGE_CALL, false, 'method', []], () => {}, callback3);

  worker._worker.emit('message', [
    PARENT_MESSAGE_CLIENT_ERROR,
    'Number',
    null,
    null,
    412,
  ]);

  expect(callback3.mock.calls[0][0]).toBe(412);
});

it('throws when the thread returns a strange message', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  worker.send(
    [CHILD_MESSAGE_CALL, false, 'method', []],
    () => {},
    () => {},
  );

  // Type 27 does not exist.
  expect(() => {
    worker._worker.emit('message', [27]);
  }).toThrow(TypeError);
});

it('does not restart the thread if it cleanly exited', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  expect(workerThreads).toHaveBeenCalledTimes(1);
  worker._worker.emit('exit', 0);
  expect(workerThreads).toHaveBeenCalledTimes(1);
});

it('resolves waitForExit() after the thread cleanly exited', async () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  expect(workerThreads).toHaveBeenCalledTimes(1);
  worker._worker.emit('exit', 0);
  await worker.waitForExit(); // should not timeout
});

it('restarts the thread when the thread dies', () => {
  const worker = new Worker({
    workerPath: '/tmp/foo',
  });

  expect(workerThreads).toHaveBeenCalledTimes(1);
  worker._worker.emit('exit', 1);
  expect(workerThreads).toHaveBeenCalledTimes(2);
});

it('terminates the thread when forceExit() is called', () => {
  const worker = new Worker({
    forkOptions: {},
    maxRetries: 3,
    workerPath: '/tmp/foo',
  });

  worker.forceExit();
  expect(worker._worker.terminate).toHaveBeenCalled();
});
