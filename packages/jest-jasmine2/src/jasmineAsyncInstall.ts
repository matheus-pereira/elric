/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This module adds ability to test async promise code with jasmine by
 * returning a promise from `it/test` and `before/afterEach/All` blocks.
 */

import co from 'co';
import isGeneratorFn from 'is-generator-fn';
import throat from 'throat';
import type {Config, Global} from '@elric/types';
import isError from './isError';
import type Spec from './jasmine/Spec';
import type {DoneFn, QueueableFn} from './queueRunner';
import type {Jasmine} from './types';

function isPromise(obj: any): obj is PromiseLike<unknown> {
  return obj && typeof obj.then === 'function';
}

const doneFnNoop = () => {};

doneFnNoop.fail = () => {};

function promisifyLifeCycleFunction(
  originalFn: (beforeAllFunction: QueueableFn['fn'], timeout?: number) => void,
  env: Jasmine['currentEnv_'],
) {
  return function <T>(
    fn:
      | ((done: DoneFn) => void | PromiseLike<T>)
      | (() => Promise<T>)
      | GeneratorFunction
      | undefined,
    timeout?: number,
  ): void {
    if (!fn) {
      // @ts-expect-error: missing fn arg is handled by originalFn
      return originalFn.call(env);
    }

    if (typeof fn !== 'function') {
      // Pass non-functions to elric, which throws a nice error.
      return originalFn.call(env, fn, timeout);
    }

    const hasDoneCallback = fn.length > 0;

    if (hasDoneCallback) {
      // Give the function a name so it can be detected in call stacks, but
      // otherwise Jasmine will handle it.
      const asyncelricLifecycleWithCallback = function (
        this: Global.TestContext,
        ...args: Array<any>
      ) {
        // @ts-expect-error: Support possible extra args at runtime
        return fn.apply(this, args);
      };
      return originalFn.call(env, asyncelricLifecycleWithCallback, timeout);
    }

    const extraError = new Error();

    // Without this line v8 stores references to all closures
    // in the stack in the Error object. This line stringifies the stack
    // property to allow garbage-collecting objects on the stack
    // https://crbug.com/v8/7142
    extraError.stack = extraError.stack;

    // We make *all* functions async and run `done` right away if they
    // didn't return a promise.
    const asyncelricLifecycle = function (done: DoneFn) {
      const wrappedFn = isGeneratorFn(fn) ? co.wrap(fn) : fn;
      const returnValue = wrappedFn.call({}, doneFnNoop);

      if (isPromise(returnValue)) {
        returnValue.then(done.bind(null, null), (error: Error) => {
          const {isError: checkIsError, message} = isError(error);

          if (message) {
            extraError.message = message;
          }
          done.fail(checkIsError ? error : extraError);
        });
      } else {
        done();
      }
    };

    return originalFn.call(env, asyncelricLifecycle, timeout);
  };
}

// Similar to promisifyLifeCycleFunction but throws an error
// when the return value is neither a Promise nor `undefined`
function promisifyIt(
  originalFn: (
    description: string,
    fn: QueueableFn['fn'],
    timeout?: number,
  ) => Spec,
  env: Jasmine['currentEnv_'],
  jasmine: Jasmine,
) {
  return function (
    specName: string,
    fn?: (done: DoneFn) => void | PromiseLike<void>,
    timeout?: number,
  ): Spec {
    if (!fn) {
      // @ts-expect-error: missing fn arg is handled by originalFn
      const spec = originalFn.call(env, specName);
      spec.pend('not implemented');
      return spec;
    }

    if (typeof fn !== 'function') {
      // Pass non-functions to elric, which throws a nice error.
      return originalFn.call(env, specName, fn, timeout);
    }

    const hasDoneCallback = fn.length > 0;

    if (hasDoneCallback) {
      // Give the function a name so it can be detected in call stacks, but
      // otherwise Jasmine will handle it.
      const asyncelricTestWithCallback = function (
        this: Global.TestContext,
        ...args: Array<any>
      ) {
        // @ts-expect-error: Support possible extra args at runtime
        return fn.apply(this, args);
      };
      return originalFn.call(env, specName, asyncelricTestWithCallback, timeout);
    }

    const extraError = new Error();

    // Without this line v8 stores references to all closures
    // in the stack in the Error object. This line stringifies the stack
    // property to allow garbage-collecting objects on the stack
    // https://crbug.com/v8/7142
    extraError.stack = extraError.stack;

    const asyncelricTest = function (done: DoneFn) {
      const wrappedFn = isGeneratorFn(fn) ? co.wrap(fn) : fn;
      const returnValue = wrappedFn.call({}, doneFnNoop);

      if (isPromise(returnValue)) {
        returnValue.then(done.bind(null, null), (error: Error) => {
          const {isError: checkIsError, message} = isError(error);

          if (message) {
            extraError.message = message;
          }

          if (jasmine.Spec.isPendingSpecException(error)) {
            env.pending(message!);
            done();
          } else {
            done.fail(checkIsError ? error : extraError);
          }
        });
      } else if (returnValue === undefined) {
        done();
      } else {
        done.fail(
          new Error(
            'elric: `it` and `test` must return either a Promise or undefined.',
          ),
        );
      }
    };

    return originalFn.call(env, specName, asyncelricTest, timeout);
  };
}

function makeConcurrent(
  originalFn: (
    description: string,
    fn: QueueableFn['fn'],
    timeout?: number,
  ) => Spec,
  env: Jasmine['currentEnv_'],
  mutex: ReturnType<typeof throat>,
): Global.ItConcurrentBase {
  const concurrentFn = function (
    specName: string,
    fn: Global.ConcurrentTestFn,
    timeout?: number,
  ) {
    let promise: Promise<unknown> = Promise.resolve();

    const spec = originalFn.call(env, specName, () => promise, timeout);
    if (env != null && !env.specFilter(spec)) {
      return spec;
    }

    try {
      promise = mutex(() => {
        const promise = fn();
        if (isPromise(promise)) {
          return promise;
        }
        throw new Error(
          `elric: concurrent test "${spec.getFullName()}" must return a Promise.`,
        );
      });
    } catch (error: unknown) {
      promise = Promise.reject(error);
    }
    // Avoid triggering the uncaught promise rejection handler in case the test errors before
    // being awaited on.
    promise.catch(() => {});

    return spec;
  };
  // each is binded after the function is made concurrent, so for now it is made noop
  concurrentFn.each = () => () => {};
  return concurrentFn;
}

export default function jasmineAsyncInstall(
  globalConfig: Config.GlobalConfig,
  global: Global.Global,
): void {
  const jasmine = global.jasmine as Jasmine;
  const mutex = throat(globalConfig.maxConcurrency);

  const env = jasmine.getEnv();
  env.it = promisifyIt(env.it, env, jasmine);
  env.fit = promisifyIt(env.fit, env, jasmine);
  global.it.concurrent = (env => {
    const concurrent = makeConcurrent(
      env.it,
      env,
      mutex,
    ) as Global.ItConcurrentExtended;
    concurrent.only = makeConcurrent(env.fit, env, mutex);
    concurrent.skip = makeConcurrent(env.xit, env, mutex);
    return concurrent;
  })(env);
  global.fit.concurrent = makeConcurrent(env.fit, env, mutex);
  env.afterAll = promisifyLifeCycleFunction(env.afterAll, env);
  env.afterEach = promisifyLifeCycleFunction(env.afterEach, env);
  env.beforeAll = promisifyLifeCycleFunction(env.beforeAll, env);
  env.beforeEach = promisifyLifeCycleFunction(env.beforeEach, env);
}
