/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Context} from 'vm';
import {JSDOM, ResourceLoader, VirtualConsole} from 'jsdom';
import type {EnvironmentContext, elricEnvironment} from '@elric/environment';
import {LegacyFakeTimers, ModernFakeTimers} from '@elric/fake-timers';
import type {Config, Global} from '@elric/types';
import {ModuleMocker} from 'elric-mock';
import {installCommonGlobals} from 'elric-util';

// The `Window` interface does not have an `Error.stackTraceLimit` property, but
// `JSDOMEnvironment` assumes it is there.
type Win = Window &
  Global.Global & {
    Error: {
      stackTraceLimit: number;
    };
  };

class JSDOMEnvironment implements elricEnvironment<number> {
  private dom: JSDOM | null;
  fakeTimers: LegacyFakeTimers<number> | null;
  fakeTimersModern: ModernFakeTimers | null;
  global: Win;
  private errorEventListener: ((event: Event & {error: Error}) => void) | null;
  moduleMocker: ModuleMocker | null;

  constructor(config: Config.ProjectConfig, options?: EnvironmentContext) {
    this.dom = new JSDOM(
      typeof config.testEnvironmentOptions.html === 'string'
        ? config.testEnvironmentOptions.html
        : '<!DOCTYPE html>',
      {
        pretendToBeVisual: true,
        resources:
          typeof config.testEnvironmentOptions.userAgent === 'string'
            ? new ResourceLoader({
                userAgent: config.testEnvironmentOptions.userAgent,
              })
            : undefined,
        runScripts: 'dangerously',
        url: config.testURL,
        virtualConsole: new VirtualConsole().sendTo(
          options?.console || console,
        ),
        ...config.testEnvironmentOptions,
      },
    );
    const global = (this.global = this.dom.window.document
      .defaultView as unknown as Win);

    if (!global) {
      throw new Error('JSDOM did not return a Window object');
    }

    // for "universal" code (code should use `globalThis`)
    global.global = global as any;

    // Node's error-message stack size is limited at 10, but it's pretty useful
    // to see more than that when a test fails.
    this.global.Error.stackTraceLimit = 100;
    installCommonGlobals(global as any, config.globals);

    // TODO: remove this ASAP, but it currently causes tests to run really slow
    global.Buffer = Buffer;

    // Report uncaught errors.
    this.errorEventListener = event => {
      if (userErrorListenerCount === 0 && event.error) {
        process.emit('uncaughtException', event.error);
      }
    };
    global.addEventListener('error', this.errorEventListener);

    // However, don't report them as uncaught if the user listens to 'error' event.
    // In that case, we assume the might have custom error handling logic.
    const originalAddListener = global.addEventListener;
    const originalRemoveListener = global.removeEventListener;
    let userErrorListenerCount = 0;
    global.addEventListener = function (
      ...args: Parameters<typeof originalAddListener>
    ) {
      if (args[0] === 'error') {
        userErrorListenerCount++;
      }
      return originalAddListener.apply(this, args);
    };
    global.removeEventListener = function (
      ...args: Parameters<typeof originalRemoveListener>
    ) {
      if (args[0] === 'error') {
        userErrorListenerCount--;
      }
      return originalRemoveListener.apply(this, args);
    };

    this.moduleMocker = new ModuleMocker(global as any);

    const timerConfig = {
      idToRef: (id: number) => id,
      refToId: (ref: number) => ref,
    };

    this.fakeTimers = new LegacyFakeTimers({
      config,
      global: global as unknown as typeof globalThis,
      moduleMocker: this.moduleMocker,
      timerConfig,
    });

    this.fakeTimersModern = new ModernFakeTimers({
      config,
      global: global as unknown as typeof globalThis,
    });
  }

  async setup(): Promise<void> {}

  async teardown(): Promise<void> {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }
    if (this.fakeTimersModern) {
      this.fakeTimersModern.dispose();
    }
    if (this.global) {
      if (this.errorEventListener) {
        this.global.removeEventListener('error', this.errorEventListener);
      }
      this.global.close();

      // Dispose "document" to prevent "load" event from triggering.

      // Note that this.global.close() will trigger the CustomElement::disconnectedCallback
      // Do not reset the document before CustomElement disconnectedCallback function has finished running,
      // document should be accessible within disconnectedCallback.
      Object.defineProperty(this.global, 'document', {value: null});
    }
    this.errorEventListener = null;
    // @ts-expect-error
    this.global = null;
    this.dom = null;
    this.fakeTimers = null;
    this.fakeTimersModern = null;
  }

  getVmContext(): Context | null {
    if (this.dom) {
      return this.dom.getInternalVMContext();
    }
    return null;
  }
}

export = JSDOMEnvironment;
