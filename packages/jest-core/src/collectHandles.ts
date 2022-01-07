/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable local/ban-types-eventually */

import * as asyncHooks from 'async_hooks';
import {promisify} from 'util';
import stripAnsi = require('strip-ansi');
import type {Config} from '@elric/types';
import {formatExecError} from 'elric-message-util';
import {ErrorWithStack} from 'elric-util';

export type HandleCollectionResult = () => Promise<Array<Error>>;

function stackIsFromUser(stack: string) {
  // Either the test file, or something required by it
  if (stack.includes('Runtime.requireModule')) {
    return true;
  }

  // elric-jasmine it or describe call
  if (stack.includes('asyncelricTest') || stack.includes('asyncelricLifecycle')) {
    return true;
  }

  // An async function call from within circus
  if (stack.includes('callAsyncCircusFn')) {
    // elric-circus it or describe call
    return (
      stack.includes('_callCircusTest') || stack.includes('_callCircusHook')
    );
  }

  return false;
}

const alwaysActive = () => true;

// @ts-expect-error: doesn't exist in v10 typings
const hasWeakRef = typeof WeakRef === 'function';

const asyncSleep = promisify(setTimeout);

// Inspired by https://github.com/mafintosh/why-is-node-running/blob/master/index.js
// Extracted as we want to format the result ourselves
export default function collectHandles(): HandleCollectionResult {
  const activeHandles = new Map<
    number,
    {error: Error; isActive: () => boolean}
  >();
  const hook = asyncHooks.createHook({
    destroy(asyncId) {
      activeHandles.delete(asyncId);
    },
    init: function initHook(
      asyncId,
      type,
      triggerAsyncId,
      resource: {} | NodeJS.Timeout,
    ) {
      // Skip resources that should not generally prevent the process from
      // exiting, not last a meaningfully long time, or otherwise shouldn't be
      // tracked.
      if (
        type === 'PROMISE' ||
        type === 'TIMERWRAP' ||
        type === 'ELDHISTOGRAM' ||
        type === 'PerformanceObserver' ||
        type === 'RANDOMBYTESREQUEST' ||
        type === 'DNSCHANNEL' ||
        type === 'ZLIB'
      ) {
        return;
      }
      const error = new ErrorWithStack(type, initHook, 100);
      let fromUser = stackIsFromUser(error.stack || '');

      // If the async resource was not directly created by user code, but was
      // triggered by another async resource from user code, track it and use
      // the original triggering resource's stack.
      if (!fromUser) {
        const triggeringHandle = activeHandles.get(triggerAsyncId);
        if (triggeringHandle) {
          fromUser = true;
          error.stack = triggeringHandle.error.stack;
        }
      }

      if (fromUser) {
        let isActive: () => boolean;

        if (type === 'Timeout' || type === 'Immediate') {
          // Timer that supports hasRef (Node v11+)
          if ('hasRef' in resource) {
            if (hasWeakRef) {
              // @ts-expect-error: doesn't exist in v10 typings
              const ref = new WeakRef(resource);
              isActive = () => {
                return ref.deref()?.hasRef() ?? false;
              };
            } else {
              // @ts-expect-error: doesn't exist in v10 typings
              isActive = resource.hasRef.bind(resource);
            }
          } else {
            // Timer that doesn't support hasRef
            isActive = alwaysActive;
          }
        } else {
          // Any other async resource
          isActive = alwaysActive;
        }

        activeHandles.set(asyncId, {error, isActive});
      }
    },
  });

  hook.enable();

  return async () => {
    // Wait briefly for any async resources that have been queued for
    // destruction to actually be destroyed.
    // For example, Node.js TCP Servers are not destroyed until *after* their
    // `close` callback runs. If someone finishes a test from the `close`
    // callback, we will not yet have seen the resource be destroyed here.
    await asyncSleep(100);

    hook.disable();

    // Get errors for every async resource still referenced at this moment
    const result = Array.from(activeHandles.values())
      .filter(({isActive}) => isActive())
      .map(({error}) => error);

    activeHandles.clear();
    return result;
  };
}

export function formatHandleErrors(
  errors: Array<Error>,
  config: Config.ProjectConfig,
): Array<string> {
  const stacks = new Set();

  return (
    errors
      .map(err =>
        formatExecError(err, config, {noStackTrace: false}, undefined, true),
      )
      // E.g. timeouts might give multiple traces to the same line of code
      // This hairy filtering tries to remove entries with duplicate stack traces
      .filter(handle => {
        const ansiFree: string = stripAnsi(handle);

        const match = ansiFree.match(/\s+at(.*)/);

        if (!match || match.length < 2) {
          return true;
        }

        const stack = ansiFree.substr(ansiFree.indexOf(match[1])).trim();

        if (stacks.has(stack)) {
          return false;
        }

        stacks.add(stack);

        return true;
      })
  );
}
