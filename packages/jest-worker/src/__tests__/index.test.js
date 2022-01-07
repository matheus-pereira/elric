/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

let Farm;
let WorkerPool;
let Queue;

beforeEach(() => {
  elric.mock('../Farm', () => {
    const fakeClass = elric.fn(() => ({
      doWork: elric.fn().mockResolvedValue(42),
    }));

    return {
      __esModule: true,
      default: fakeClass,
    };
  });

  elric.mock('../WorkerPool', () => {
    const fakeWorker = elric.fn(() => ({
      createWorker: elric.fn(),
      end: elric.fn(),
      getStderr: () => elric.fn(a => a),
      getStdout: () => elric.fn(a => a),
      send: elric.fn(),
    }));

    return {
      __esModule: true,
      default: fakeWorker,
    };
  });

  elric.mock(
    '/fake-worker.js',
    () => ({
      _shouldNotExist1() {},
      methodA() {},
      methodB() {},
    }),
    {virtual: true},
  );

  elric.mock('/fake-worker-with-default-method.js', () => () => {}, {
    virtual: true,
  });

  Farm = require('..').Worker;
  Queue = require('../Farm').default;
  WorkerPool = require('../WorkerPool').default;
});

afterEach(() => {
  elric.resetModules();
});

it('exposes the right API using default working', () => {
  const farm = new Farm('/tmp/baz.js', {
    exposedMethods: ['foo', 'bar'],
    numWorkers: 4,
  });

  expect(typeof farm.foo).toBe('function');
  expect(typeof farm.bar).toBe('function');
});

it('exposes the right API using passed worker', () => {
  const WorkerPool = elric.fn(() => ({
    createWorker: elric.fn(),
    end: elric.fn(),
    getStderr: () => elric.fn(a => a),
    getStdout: () => elric.fn(a => a),
    send: elric.fn(),
  }));

  const farm = new Farm('/tmp/baz.js', {
    WorkerPool,
    exposedMethods: ['foo', 'bar'],
    numWorkers: 4,
  });

  expect(typeof farm.foo).toBe('function');
  expect(typeof farm.bar).toBe('function');
});

it('breaks if any of the forbidden methods is tried to be exposed', () => {
  expect(
    () => new Farm('/tmp/baz.js', {exposedMethods: ['getStdout']}),
  ).toThrow();

  expect(
    () => new Farm('/tmp/baz.js', {exposedMethods: ['getStderr']}),
  ).toThrow();

  expect(() => new Farm('/tmp/baz.js', {exposedMethods: ['end']})).toThrow();
});

it('works with minimal options', () => {
  const farm1 = new Farm('/fake-worker.js');

  expect(Queue).toHaveBeenCalledTimes(1);
  expect(WorkerPool).toHaveBeenCalledTimes(1);
  expect(typeof farm1.methodA).toBe('function');
  expect(typeof farm1.methodB).toBe('function');
  expect(typeof farm1._shouldNotExist).not.toBe('function');

  const farm2 = new Farm('/fake-worker-with-default-method.js');

  expect(typeof farm2.default).toBe('function');
});

it('does not let make calls after the farm is ended', () => {
  const farm = new Farm('/tmp/baz.js', {
    exposedMethods: ['foo', 'bar'],
    numWorkers: 4,
  });

  farm.end();

  expect(farm._workerPool.end).toHaveBeenCalledTimes(1);
  expect(() => farm.foo()).toThrow(
    'Farm is ended, no more calls can be done to it',
  );
  expect(() => farm.bar()).toThrow(
    'Farm is ended, no more calls can be done to it',
  );
});

it('does not let end the farm after it is ended', async () => {
  const farm = new Farm('/tmp/baz.js', {
    exposedMethods: ['foo', 'bar'],
    numWorkers: 4,
  });

  farm.end();
  expect(farm._workerPool.end).toHaveBeenCalledTimes(1);
  await expect(farm.end()).rejects.toThrow(
    'Farm is ended, no more calls can be done to it',
  );
  await expect(farm.end()).rejects.toThrow(
    'Farm is ended, no more calls can be done to it',
  );
  expect(farm._workerPool.end).toHaveBeenCalledTimes(1);
});

it('calls doWork', async () => {
  const farm = new Farm('/tmp/baz.js', {
    exposedMethods: ['foo', 'bar'],
    numWorkers: 1,
  });

  const promise = farm.foo('car', 'plane');

  expect(await promise).toEqual(42);
});

it('calls getStderr and getStdout from worker', async () => {
  const farm = new Farm('/tmp/baz.js', {
    exposedMethods: ['foo', 'bar'],
    numWorkers: 1,
  });

  expect(farm.getStderr()('err')).toEqual('err');
  expect(farm.getStdout()('out')).toEqual('out');
});
