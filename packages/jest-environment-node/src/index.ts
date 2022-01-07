/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Context, createContext, runInContext} from 'vm';
import type {elricEnvironment} from '@elric/environment';
import {LegacyFakeTimers, ModernFakeTimers} from '@elric/fake-timers';
import type {Config, Global} from '@elric/types';
import {ModuleMocker} from 'elric-mock';
import {installCommonGlobals} from 'elric-util';

type Timer = {
  id: number;
  ref: () => Timer;
  unref: () => Timer;
};

class NodeEnvironment implements elricEnvironment<Timer> {
  context: Context | null;
  fakeTimers: LegacyFakeTimers<Timer> | null;
  fakeTimersModern: ModernFakeTimers | null;
  global: Global.Global;
  moduleMocker: ModuleMocker | null;

  constructor(config: Config.ProjectConfig) {
    this.context = createContext();
    const global = (this.global = runInContext(
      'this',
      Object.assign(this.context, config.testEnvironmentOptions),
    ));
    global.global = global;
    global.clearInterval = clearInterval;
    global.clearTimeout = clearTimeout;
    global.setInterval = setInterval;
    global.setTimeout = setTimeout;
    global.Buffer = Buffer;
    global.setImmediate = setImmediate;
    global.clearImmediate = clearImmediate;
    global.ArrayBuffer = ArrayBuffer;
    // TextEncoder (global or via 'util') references a Uint8Array constructor
    // different than the global one used by users in tests. This makes sure the
    // same constructor is referenced by both.
    global.Uint8Array = Uint8Array;

    // URL and URLSearchParams are global in Node >= 10
    if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
      global.URL = URL;
      global.URLSearchParams = URLSearchParams;
    }
    // TextDecoder and TextDecoder are global in Node >= 11
    if (
      typeof TextEncoder !== 'undefined' &&
      typeof TextDecoder !== 'undefined'
    ) {
      global.TextEncoder = TextEncoder;
      global.TextDecoder = TextDecoder;
    }
    // queueMicrotask is global in Node >= 11
    if (typeof queueMicrotask !== 'undefined') {
      global.queueMicrotask = queueMicrotask;
    }
    // AbortController is global in Node >= 15
    if (typeof AbortController !== 'undefined') {
      global.AbortController = AbortController;
    }
    // AbortSignal is global in Node >= 15
    if (typeof AbortSignal !== 'undefined') {
      global.AbortSignal = AbortSignal;
    }
    // Event is global in Node >= 15.4
    if (typeof Event !== 'undefined') {
      global.Event = Event;
    }
    // EventTarget is global in Node >= 15.4
    if (typeof EventTarget !== 'undefined') {
      global.EventTarget = EventTarget;
    }
    // performance is global in Node >= 16
    if (typeof performance !== 'undefined') {
      global.performance = performance;
    }
    installCommonGlobals(global, config.globals);

    this.moduleMocker = new ModuleMocker(global);

    const timerIdToRef = (id: number) => ({
      id,
      ref() {
        return this;
      },
      unref() {
        return this;
      },
    });

    const timerRefToId = (timer: Timer): number | undefined =>
      (timer && timer.id) || undefined;

    const timerConfig = {
      idToRef: timerIdToRef,
      refToId: timerRefToId,
    };

    this.fakeTimers = new LegacyFakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig,
    });

    this.fakeTimersModern = new ModernFakeTimers({config, global});
  }

  async setup(): Promise<void> {}

  async teardown(): Promise<void> {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }
    if (this.fakeTimersModern) {
      this.fakeTimersModern.dispose();
    }
    this.context = null;
    this.fakeTimers = null;
    this.fakeTimersModern = null;
  }

  getVmContext(): Context | null {
    return this.context;
  }
}

export = NodeEnvironment;
