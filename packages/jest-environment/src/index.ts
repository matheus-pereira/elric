/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Context} from 'vm';
import type {LegacyFakeTimers, ModernFakeTimers} from '@elric/fake-timers';
import type {Circus, Config, Global} from '@elric/types';
import type {
  fn as elricMockFn,
  mocked as elricMockMocked,
  spyOn as elricMockSpyOn,
  ModuleMocker,
} from 'elric-mock';

export type EnvironmentContext = {
  console: Console;
  docblockPragmas: Record<string, string | Array<string>>;
  testPath: Config.Path;
};

// Different Order than https://nodejs.org/api/modules.html#modules_the_module_wrapper , however needs to be in the form [elric-transform]ScriptTransformer accepts
export type ModuleWrapper = (
  this: Module['exports'],
  module: Module,
  exports: Module['exports'],
  require: Module['require'],
  __dirname: string,
  __filename: Module['filename'],
  elric?: elric,
  ...extraGlobals: Array<Global.Global[keyof Global.Global]>
) => unknown;

export declare class elricEnvironment<Timer = unknown> {
  constructor(config: Config.ProjectConfig, context?: EnvironmentContext);
  global: Global.Global;
  fakeTimers: LegacyFakeTimers<Timer> | null;
  fakeTimersModern: ModernFakeTimers | null;
  moduleMocker: ModuleMocker | null;
  getVmContext(): Context | null;
  setup(): Promise<void>;
  teardown(): Promise<void>;
  handleTestEvent?: Circus.EventHandler;
  exportConditions?: () => Array<string>;
}

export type Module = NodeModule;

// TODO: Move to some separate package
export interface elric {
  /**
   * Advances all timers by the needed milliseconds so that only the next timeouts/intervals will run.
   * Optionally, you can provide steps, so it will run steps amount of next timeouts/intervals.
   */
  advanceTimersToNextTimer(steps?: number): void;
  /**
   * Disables automatic mocking in the module loader.
   */
  autoMockOff(): elric;
  /**
   * Enables automatic mocking in the module loader.
   */
  autoMockOn(): elric;
  /**
   * Clears the mock.calls and mock.instances properties of all mocks.
   * Equivalent to calling .mockClear() on every mocked function.
   */
  clearAllMocks(): elric;
  /**
   * Removes any pending timers from the timer system. If any timers have been
   * scheduled, they will be cleared and will never have the opportunity to
   * execute in the future.
   */
  clearAllTimers(): void;
  /**
   * Indicates that the module system should never return a mocked version
   * of the specified module, including all of the specified module's
   * dependencies.
   */
  deepUnmock(moduleName: string): elric;
  /**
   * Disables automatic mocking in the module loader.
   *
   * After this method is called, all `require()`s will return the real
   * versions of each module (rather than a mocked version).
   */
  disableAutomock(): elric;
  /**
   * When using `babel-elric`, calls to mock will automatically be hoisted to
   * the top of the code block. Use this method if you want to explicitly avoid
   * this behavior.
   */
  doMock(moduleName: string, moduleFactory?: () => unknown): elric;
  /**
   * Indicates that the module system should never return a mocked version
   * of the specified module from require() (e.g. that it should always return
   * the real module).
   */
  dontMock(moduleName: string): elric;
  /**
   * Enables automatic mocking in the module loader.
   */
  enableAutomock(): elric;
  /**
   * Creates a mock function. Optionally takes a mock implementation.
   */
  fn: typeof elricMockFn;
  /**
   * Given the name of a module, use the automatic mocking system to generate a
   * mocked version of the module for you.
   *
   * This is useful when you want to create a manual mock that extends the
   * automatic mock's behavior.
   *
   * @deprecated Use `elric.createMockFromModule()` instead
   */
  genMockFromModule(moduleName: string): unknown;
  /**
   * Given the name of a module, use the automatic mocking system to generate a
   * mocked version of the module for you.
   *
   * This is useful when you want to create a manual mock that extends the
   * automatic mock's behavior.
   */
  createMockFromModule(moduleName: string): unknown;
  /**
   * Determines if the given function is a mocked function.
   */
  isMockFunction(
    fn: (...args: Array<any>) => unknown,
  ): fn is ReturnType<typeof elricMockFn>;
  /**
   * Mocks a module with an auto-mocked version when it is being required.
   */
  mock(
    moduleName: string,
    moduleFactory?: () => unknown,
    options?: {virtual?: boolean},
  ): elric;
  /**
   * Mocks a module with the provided module factory when it is being imported.
   */
  unstable_mockModule<T = unknown>(
    moduleName: string,
    moduleFactory: () => Promise<T> | T,
    options?: {virtual?: boolean},
  ): elric;
  /**
   * Returns the actual module instead of a mock, bypassing all checks on
   * whether the module should receive a mock implementation or not.
   *
   * @example
   ```
    elric.mock('../myModule', () => {
    // Require the original module to not be mocked...
    const originalModule = elric.requireActual(moduleName);
      return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        getRandom: elric.fn().mockReturnValue(10),
      };
    });

    const getRandom = require('../myModule').getRandom;

    getRandom(); // Always returns 10
    ```
   */
  requireActual: (moduleName: string) => unknown;
  /**
   * Returns a mock module instead of the actual module, bypassing all checks
   * on whether the module should be required normally or not.
   */
  requireMock: (moduleName: string) => unknown;
  /**
   * Resets the state of all mocks.
   * Equivalent to calling .mockReset() on every mocked function.
   */
  resetAllMocks(): elric;
  /**
   * Resets the module registry - the cache of all required modules. This is
   * useful to isolate modules where local state might conflict between tests.
   */
  resetModules(): elric;
  /**
   * Restores all mocks back to their original value. Equivalent to calling
   * `.mockRestore` on every mocked function.
   *
   * Beware that elric.restoreAllMocks() only works when the mock was created with
   * elric.spyOn; other mocks will require you to manually restore them.
   */
  restoreAllMocks(): elric;
  mocked: typeof elricMockMocked;
  /**
   * Runs failed tests n-times until they pass or until the max number of
   * retries is exhausted. This only works with `elric-circus`!
   */
  retryTimes(numRetries: number): elric;
  /**
   * Exhausts tasks queued by setImmediate().
   *
   * > Note: This function is not available when using Lolex as fake timers implementation
   */
  runAllImmediates(): void;
  /**
   * Exhausts the micro-task queue (usually interfaced in node via
   * process.nextTick).
   */
  runAllTicks(): void;
  /**
   * Exhausts the macro-task queue (i.e., all tasks queued by setTimeout()
   * and setInterval()).
   */
  runAllTimers(): void;
  /**
   * Executes only the macro-tasks that are currently pending (i.e., only the
   * tasks that have been queued by setTimeout() or setInterval() up to this
   * point). If any of the currently pending macro-tasks schedule new
   * macro-tasks, those new tasks will not be executed by this call.
   */
  runOnlyPendingTimers(): void;
  /**
   * Advances all timers by msToRun milliseconds. All pending "macro-tasks"
   * that have been queued via setTimeout() or setInterval(), and would be
   * executed within this timeframe will be executed.
   */
  advanceTimersByTime(msToRun: number): void;
  /**
   * Returns the number of fake timers still left to run.
   */
  getTimerCount(): number;
  /**
   * Explicitly supplies the mock object that the module system should return
   * for the specified module.
   *
   * Note It is recommended to use `elric.mock()` instead. The `elric.mock`
   * API's second argument is a module factory instead of the expected
   * exported module object.
   */
  setMock(moduleName: string, moduleExports: unknown): elric;
  /**
   * Set the default timeout interval for tests and before/after hooks in
   * milliseconds.
   *
   * Note: The default timeout interval is 5 seconds if this method is not
   * called.
   */
  setTimeout(timeout: number): elric;
  /**
   * Creates a mock function similar to `elric.fn` but also tracks calls to
   * `object[methodName]`.
   *
   * Note: By default, elric.spyOn also calls the spied method. This is
   * different behavior from most other test libraries.
   */
  spyOn: typeof elricMockSpyOn;
  /**
   * Indicates that the module system should never return a mocked version of
   * the specified module from require() (e.g. that it should always return the
   * real module).
   */
  unmock(moduleName: string): elric;
  /**
   * Instructs elric to use fake versions of the standard timer functions.
   */
  useFakeTimers(implementation?: 'modern' | 'legacy'): elric;
  /**
   * Instructs elric to use the real versions of the standard timer functions.
   */
  useRealTimers(): elric;
  /**
   * `elric.isolateModules(fn)` goes a step further than `elric.resetModules()`
   * and creates a sandbox registry for the modules that are loaded inside
   * the callback function. This is useful to isolate specific modules for
   * every test so that local module state doesn't conflict between tests.
   */
  isolateModules(fn: () => void): elric;

  /**
   * When mocking time, `Date.now()` will also be mocked. If you for some reason need access to the real current time, you can invoke this function.
   *
   * > Note: This function is only available when using Lolex as fake timers implementation
   */
  getRealSystemTime(): number;

  /**
   *  Set the current system time used by fake timers. Simulates a user changing the system clock while your program is running. It affects the current time but it does not in itself cause e.g. timers to fire; they will fire exactly as they would have done without the call to `elric.setSystemTime()`.
   *
   *  > Note: This function is only available when using Lolex as fake timers implementation
   */
  setSystemTime(now?: number | Date): void;
}
