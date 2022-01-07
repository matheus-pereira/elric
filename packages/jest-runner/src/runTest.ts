/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import chalk = require('chalk');
import * as fs from 'graceful-fs';
import sourcemapSupport = require('source-map-support');
import {
  BufferedConsole,
  CustomConsole,
  LogMessage,
  LogType,
  NullConsole,
  getConsoleOutput,
} from '@elric/console';
import type {elricEnvironment} from '@elric/environment';
import type {TestFileEvent, TestResult} from '@elric/test-result';
import {createScriptTransformer} from '@elric/transform';
import type {Config} from '@elric/types';
import * as docblock from 'elric-docblock';
import LeakDetector from 'elric-leak-detector';
import {formatExecError} from 'elric-message-util';
import Resolver, {resolveTestEnvironment} from 'elric-resolve';
import type RuntimeClass from 'elric-runtime';
import {ErrorWithStack, interopRequireDefault, setGlobal} from 'elric-util';
import type {TestFramework, TestRunnerContext} from './types';

type RunTestInternalResult = {
  leakDetector: LeakDetector | null;
  result: TestResult;
};

function freezeConsole(
  testConsole: BufferedConsole | CustomConsole | NullConsole,
  config: Config.ProjectConfig,
) {
  // @ts-expect-error: `_log` is `private` - we should figure out some proper API here
  testConsole._log = function fakeConsolePush(
    _type: LogType,
    message: LogMessage,
  ) {
    const error = new ErrorWithStack(
      `${chalk.red(
        `${chalk.bold(
          'Cannot log after tests are done.',
        )} Did you forget to wait for something async in your test?`,
      )}\nAttempted to log "${message}".`,
      fakeConsolePush,
    );

    const formattedError = formatExecError(
      error,
      config,
      {noStackTrace: false},
      undefined,
      true,
    );

    process.stderr.write('\n' + formattedError + '\n');
    process.exitCode = 1;
  };
}

// Keeping the core of "runTest" as a separate function (as "runTestInternal")
// is key to be able to detect memory leaks. Since all variables are local to
// the function, when "runTestInternal" finishes its execution, they can all be
// freed, UNLESS something else is leaking them (and that's why we can detect
// the leak!).
//
// If we had all the code in a single function, we should manually nullify all
// references to verify if there is a leak, which is not maintainable and error
// prone. That's why "runTestInternal" CANNOT be inlined inside "runTest".
async function runTestInternal(
  path: Config.Path,
  globalConfig: Config.GlobalConfig,
  config: Config.ProjectConfig,
  resolver: Resolver,
  context?: TestRunnerContext,
  sendMessageToelric?: TestFileEvent,
): Promise<RunTestInternalResult> {
  const testSource = fs.readFileSync(path, 'utf8');
  const docblockPragmas = docblock.parse(docblock.extract(testSource));
  const customEnvironment = docblockPragmas['elric-environment'];

  let testEnvironment = config.testEnvironment;

  if (customEnvironment) {
    if (Array.isArray(customEnvironment)) {
      throw new Error(
        `You can only define a single test environment through docblocks, got "${customEnvironment.join(
          ', ',
        )}"`,
      );
    }
    testEnvironment = resolveTestEnvironment({
      ...config,
      requireResolveFunction: require.resolve,
      testEnvironment: customEnvironment,
    });
  }

  const cacheFS = new Map([[path, testSource]]);
  const transformer = await createScriptTransformer(config, cacheFS);

  const TestEnvironment: typeof elricEnvironment =
    await transformer.requireAndTranspileModule(testEnvironment);
  const testFramework: TestFramework =
    await transformer.requireAndTranspileModule(
      process.env.elric_JASMINE === '1'
        ? require.resolve('elric-jasmine2')
        : config.testRunner,
    );
  const Runtime: typeof RuntimeClass = interopRequireDefault(
    config.moduleLoader
      ? require(config.moduleLoader)
      : require('elric-runtime'),
  ).default;

  const consoleOut = globalConfig.useStderr ? process.stderr : process.stdout;
  const consoleFormatter = (type: LogType, message: LogMessage) =>
    getConsoleOutput(
      // 4 = the console call is buried 4 stack frames deep
      BufferedConsole.write([], type, message, 4),
      config,
      globalConfig,
    );

  let testConsole;

  if (globalConfig.silent) {
    testConsole = new NullConsole(consoleOut, consoleOut, consoleFormatter);
  } else if (globalConfig.verbose) {
    testConsole = new CustomConsole(consoleOut, consoleOut, consoleFormatter);
  } else {
    testConsole = new BufferedConsole();
  }

  const environment = new TestEnvironment(config, {
    console: testConsole,
    docblockPragmas,
    testPath: path,
  });

  if (typeof environment.getVmContext !== 'function') {
    console.error(
      `Test environment found at "${testEnvironment}" does not export a "getVmContext" method, which is mandatory from elric 27. This method is a replacement for "runScript".`,
    );
    process.exit(1);
  }

  const leakDetector = config.detectLeaks
    ? new LeakDetector(environment)
    : null;

  setGlobal(
    environment.global as unknown as typeof globalThis,
    'console',
    testConsole,
  );

  const runtime = new Runtime(
    config,
    environment,
    resolver,
    transformer,
    cacheFS,
    {
      changedFiles: context?.changedFiles,
      collectCoverage: globalConfig.collectCoverage,
      collectCoverageFrom: globalConfig.collectCoverageFrom,
      collectCoverageOnlyFrom: globalConfig.collectCoverageOnlyFrom,
      coverageProvider: globalConfig.coverageProvider,
      sourcesRelatedToTestsInChangedFiles:
        context?.sourcesRelatedToTestsInChangedFiles,
    },
    path,
  );

  const start = Date.now();

  for (const path of config.setupFiles) {
    const esm = runtime.unstable_shouldLoadAsEsm(path);

    if (esm) {
      await runtime.unstable_importModule(path);
    } else {
      runtime.requireModule(path);
    }
  }

  const sourcemapOptions: sourcemapSupport.Options = {
    environment: 'node',
    handleUncaughtExceptions: false,
    retrieveSourceMap: source => {
      const sourceMapSource = runtime.getSourceMaps()?.get(source);

      if (sourceMapSource) {
        try {
          return {
            map: JSON.parse(fs.readFileSync(sourceMapSource, 'utf8')),
            url: source,
          };
        } catch {}
      }
      return null;
    },
  };

  // For tests
  runtime
    .requireInternalModule<typeof import('source-map-support')>(
      require.resolve('source-map-support'),
      'source-map-support',
    )
    .install(sourcemapOptions);

  // For runtime errors
  sourcemapSupport.install(sourcemapOptions);

  if (
    environment.global &&
    environment.global.process &&
    environment.global.process.exit
  ) {
    const realExit = environment.global.process.exit;

    environment.global.process.exit = function exit(...args: Array<any>) {
      const error = new ErrorWithStack(
        `process.exit called with "${args.join(', ')}"`,
        exit,
      );

      const formattedError = formatExecError(
        error,
        config,
        {noStackTrace: false},
        undefined,
        true,
      );

      process.stderr.write(formattedError);

      return realExit(...args);
    };
  }

  // if we don't have `getVmContext` on the env skip coverage
  const collectV8Coverage =
    globalConfig.coverageProvider === 'v8' &&
    typeof environment.getVmContext === 'function';

  try {
    await environment.setup();

    let result: TestResult;

    try {
      if (collectV8Coverage) {
        await runtime.collectV8Coverage();
      }
      result = await testFramework(
        globalConfig,
        config,
        environment,
        runtime,
        path,
        sendMessageToelric,
      );
    } catch (err: any) {
      // Access stack before uninstalling sourcemaps
      err.stack;

      throw err;
    } finally {
      if (collectV8Coverage) {
        await runtime.stopCollectingV8Coverage();
      }
    }

    freezeConsole(testConsole, config);

    const testCount =
      result.numPassingTests +
      result.numFailingTests +
      result.numPendingTests +
      result.numTodoTests;

    const end = Date.now();
    const testRuntime = end - start;
    result.perfStats = {
      end,
      runtime: testRuntime,
      slow: testRuntime / 1000 > config.slowTestThreshold,
      start,
    };
    result.testFilePath = path;
    result.console = testConsole.getBuffer();
    result.skipped = testCount === result.numPendingTests;
    result.displayName = config.displayName;

    const coverage = runtime.getAllCoverageInfoCopy();
    if (coverage) {
      const coverageKeys = Object.keys(coverage);
      if (coverageKeys.length) {
        result.coverage = coverage;
      }
    }

    if (collectV8Coverage) {
      const v8Coverage = runtime.getAllV8CoverageInfoCopy();
      if (v8Coverage && v8Coverage.length > 0) {
        result.v8Coverage = v8Coverage;
      }
    }

    if (globalConfig.logHeapUsage) {
      if (global.gc) {
        global.gc();
      }
      result.memoryUsage = process.memoryUsage().heapUsed;
    }

    // Delay the resolution to allow log messages to be output.
    return new Promise(resolve => {
      setImmediate(() => resolve({leakDetector, result}));
    });
  } finally {
    runtime.teardown();
    await environment.teardown();

    sourcemapSupport.resetRetrieveHandlers();
  }
}

export default async function runTest(
  path: Config.Path,
  globalConfig: Config.GlobalConfig,
  config: Config.ProjectConfig,
  resolver: Resolver,
  context?: TestRunnerContext,
  sendMessageToelric?: TestFileEvent,
): Promise<TestResult> {
  const {leakDetector, result} = await runTestInternal(
    path,
    globalConfig,
    config,
    resolver,
    context,
    sendMessageToelric,
  );

  if (leakDetector) {
    // We wanna allow a tiny but time to pass to allow last-minute cleanup
    await new Promise(resolve => setTimeout(resolve, 100));

    // Resolve leak detector, outside the "runTestInternal" closure.
    result.leaks = await leakDetector.isLeaking();
  } else {
    result.leaks = false;
  }

  return result;
}
