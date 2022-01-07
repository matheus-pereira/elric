/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import chalk from 'chalk';
import {elricHook, KEYS} from 'elric-watcher';
// eslint-disable-next-line import/order
import TestWatcher from '../TestWatcher';

const runelricMock = elric.fn();
const watchPluginPath = `${__dirname}/__fixtures__/watchPlugin`;
const watchPlugin2Path = `${__dirname}/__fixtures__/watchPlugin2`;
let results;

elric.mock(
  '../SearchSource',
  () =>
    class {
      constructor(context) {
        this._context = context;
      }

      findMatchingTests(pattern) {
        const paths = [
          './path/to/file1-test.js',
          './path/to/file2-test.js',
        ].filter(path => path.match(pattern));

        return {
          tests: paths.map(path => ({
            context: this._context,
            duration: null,
            path,
          })),
        };
      }
    },
);

elric.doMock('chalk', () => new chalk.Instance({level: 0}));
elric.doMock(
  '../runelric',
  () =>
    function () {
      const args = Array.from(arguments);
      const [{onComplete}] = args;
      runelricMock.apply(null, args);

      // Call the callback
      onComplete(results);

      return Promise.resolve();
    },
);

elric.doMock(
  watchPluginPath,
  () =>
    class WatchPlugin1 {
      getUsageInfo() {
        return {
          key: 's',
          prompt: 'do nothing',
        };
      }
    },
  {virtual: true},
);

elric.doMock(
  watchPlugin2Path,
  () =>
    class WatchPlugin2 {
      getUsageInfo() {
        return {
          key: 'r',
          prompt: 'do something else',
        };
      }
    },
  {virtual: true},
);

const regularUpdateGlobalConfig = require('../lib/updateGlobalConfig').default;
const updateGlobalConfig = elric.fn(regularUpdateGlobalConfig);
elric.doMock('../lib/updateGlobalConfig', () => updateGlobalConfig);

const nextTick = () => new Promise(res => process.nextTick(res));

beforeAll(() => {
  elric.spyOn(process, 'on').mockImplementation(() => {});
});

afterAll(() => {
  elric.restoreAllMocks();
});

afterEach(runelricMock.mockReset);

describe('Watch mode flows', () => {
  let watch;
  let isInteractive;
  let pipe;
  let hasteMapInstances;
  let globalConfig;
  let contexts;
  let stdin;

  beforeEach(() => {
    isInteractive = true;
    elric.doMock('elric-util/build/isInteractive', () => isInteractive);
    watch = require('../watch').default;
    const config = {
      rootDir: __dirname,
      roots: [],
      testPathIgnorePatterns: [],
      testRegex: [],
    };
    pipe = {write: elric.fn()};
    globalConfig = {watch: true};
    hasteMapInstances = [{on: () => {}}];
    contexts = [{config}];
    stdin = new MockStdin();
    results = {snapshot: {}};
  });

  afterEach(() => {
    elric.resetModules();
  });

  it('Correctly passing test path pattern', () => {
    globalConfig.testPathPattern = 'test-*';

    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);

    expect(runelricMock.mock.calls[0][0]).toMatchObject({
      contexts,
      globalConfig,
      onComplete: expect.any(Function),
      outputStream: pipe,
      testWatcher: new TestWatcher({isWatchMode: true}),
    });
  });

  it('Correctly passing test name pattern', () => {
    globalConfig.testNamePattern = 'test-*';

    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);

    expect(runelricMock.mock.calls[0][0]).toMatchObject({
      contexts,
      globalConfig,
      onComplete: expect.any(Function),
      outputStream: pipe,
      testWatcher: new TestWatcher({isWatchMode: true}),
    });
  });

  it('Runs elric once by default and shows usage', () => {
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);
    expect(runelricMock.mock.calls[0][0]).toMatchObject({
      contexts,
      globalConfig,
      onComplete: expect.any(Function),
      outputStream: pipe,
      testWatcher: new TestWatcher({isWatchMode: true}),
    });
    expect(pipe.write.mock.calls.reverse()[0]).toMatchSnapshot();
  });

  it('Runs elric in a non-interactive environment not showing usage', () => {
    elric.resetModules();
    isInteractive = false;

    watch = require('../watch').default;
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);
    expect(runelricMock.mock.calls[0][0]).toMatchObject({
      contexts,
      globalConfig,
      onComplete: expect.any(Function),
      outputStream: pipe,
      testWatcher: new TestWatcher({isWatchMode: true}),
    });
    expect(pipe.write.mock.calls.reverse()[0]).toMatchSnapshot();
  });

  it('resolves relative to the package root', () => {
    expect(async () => {
      await watch(
        {
          ...globalConfig,
          rootDir: __dirname,
          watchPlugins: [{config: {}, path: watchPluginPath}],
        },
        contexts,
        pipe,
        hasteMapInstances,
        stdin,
      );
    }).not.toThrow();
  });

  it('shows prompts for WatchPlugins in alphabetical order', async () => {
    await watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [
          {config: {}, path: watchPluginPath},
          {config: {}, path: watchPlugin2Path},
        ],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    const pipeMockCalls = pipe.write.mock.calls;

    const determiningTestsToRun = pipeMockCalls.findIndex(
      ([c]) => c === 'Determining test suites to run...',
    );

    expect(pipeMockCalls.slice(determiningTestsToRun + 1)).toMatchSnapshot();
  });

  it('shows update snapshot prompt (without interactive)', async () => {
    results = {snapshot: {failure: true}};

    watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    const pipeMockCalls = pipe.write.mock.calls;

    const determiningTestsToRun = pipeMockCalls.findIndex(
      ([c]) => c === 'Determining test suites to run...',
    );

    expect(pipeMockCalls.slice(determiningTestsToRun + 1)).toMatchSnapshot();
  });

  it('shows update snapshot prompt (with interactive)', async () => {
    results = {
      numFailedTests: 1,
      snapshot: {
        failure: true,
      },
      testPath: 'test.js',
      testResults: [
        {
          snapshot: {
            unmatched: true,
          },
          testResults: [
            {
              status: 'failed',
              title: 'test a',
            },
          ],
        },
      ],
    };

    watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    const pipeMockCalls = pipe.write.mock.calls;

    const determiningTestsToRun = pipeMockCalls.findIndex(
      ([c]) => c === 'Determining test suites to run...',
    );

    expect(pipeMockCalls.slice(determiningTestsToRun + 1)).toMatchSnapshot();
  });

  it('allows WatchPlugins to hook into elricHook', async () => {
    const apply = elric.fn();
    const pluginPath = `${__dirname}/__fixtures__/plugin_path_register`;
    elric.doMock(
      pluginPath,
      () =>
        class WatchPlugin {
          constructor() {
            this.apply = apply;
          }
        },
      {virtual: true},
    );

    watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [{config: {}, path: pluginPath}],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    await nextTick();

    expect(apply).toHaveBeenCalled();
  });

  it('allows WatchPlugins to override eligible internal plugins', async () => {
    const run = elric.fn(() => Promise.resolve());
    const pluginPath = `${__dirname}/__fixtures__/plugin_path_override`;
    elric.doMock(
      pluginPath,
      () =>
        class WatchPlugin {
          constructor() {
            this.run = run;
          }
          getUsageInfo() {
            return {
              key: 'p',
              prompt: 'custom "P" plugin',
            };
          }
        },
      {virtual: true},
    );

    watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [{config: {}, path: pluginPath}],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    await nextTick();

    expect(pipe.write.mock.calls.reverse()[0]).toMatchSnapshot();

    stdin.emit('p');
    await nextTick();

    expect(run).toHaveBeenCalled();
  });

  describe('when dealing with potential watch plugin key conflicts', () => {
    it.each`
      key    | plugin
      ${'q'} | ${'Quit'}
      ${'u'} | ${'UpdateSnapshots'}
      ${'i'} | ${'UpdateSnapshotsInteractive'}
    `(
      'forbids WatchPlugins overriding reserved internal plugins',
      async ({key}) => {
        const run = elric.fn(() => Promise.resolve());
        const pluginPath = `${__dirname}/__fixtures__/plugin_bad_override_${key}`;
        elric.doMock(
          pluginPath,
          () =>
            class OffendingWatchPlugin {
              constructor() {
                this.run = run;
              }
              getUsageInfo() {
                return {
                  key,
                  prompt: `custom "${key.toUpperCase()}" plugin`,
                };
              }
            },
          {virtual: true},
        );

        await expect(
          watch(
            {
              ...globalConfig,
              rootDir: __dirname,
              watchPlugins: [{config: {}, path: pluginPath}],
            },
            contexts,
            pipe,
            hasteMapInstances,
            stdin,
          ),
        ).rejects.toThrowError(
          new RegExp(
            `Watch plugin OffendingWatchPlugin attempted to register key <${key}>,\\s+that is reserved internally for .+\\.\\s+Please change the configuration key for this plugin\\.`,
            'm',
          ),
        );
      },
    );

    // The jury's still out on 'a', 'c', 'f', 'o', 'w' and '?'…
    // See https://github.com/facebook/elric/issues/6693
    it.each`
      key    | plugin
      ${'t'} | ${'TestNamePattern'}
      ${'p'} | ${'TestPathPattern'}
    `(
      'allows WatchPlugins to override non-reserved internal plugins',
      ({key}) => {
        const run = elric.fn(() => Promise.resolve());
        const pluginPath = `${__dirname}/__fixtures__/plugin_valid_override_${key}`;
        elric.doMock(
          pluginPath,
          () =>
            class ValidWatchPlugin {
              constructor() {
                this.run = run;
              }
              getUsageInfo() {
                return {
                  key,
                  prompt: `custom "${key.toUpperCase()}" plugin`,
                };
              }
            },
          {virtual: true},
        );

        watch(
          {
            ...globalConfig,
            rootDir: __dirname,
            watchPlugins: [{config: {}, path: pluginPath}],
          },
          contexts,
          pipe,
          hasteMapInstances,
          stdin,
        );
      },
    );

    it('forbids third-party WatchPlugins overriding each other', async () => {
      const pluginPaths = ['Foo', 'Bar'].map(ident => {
        const run = elric.fn(() => Promise.resolve());
        const pluginPath = `${__dirname}/__fixtures__/plugin_bad_override_${ident.toLowerCase()}`;
        elric.doMock(
          pluginPath,
          () => {
            class OffendingThirdPartyWatchPlugin {
              constructor() {
                this.run = run;
              }
              getUsageInfo() {
                return {
                  key: '!',
                  prompt: `custom "!" plugin ${ident}`,
                };
              }
            }
            OffendingThirdPartyWatchPlugin.displayName = `Offending${ident}ThirdPartyWatchPlugin`;
            return OffendingThirdPartyWatchPlugin;
          },
          {virtual: true},
        );
        return pluginPath;
      });

      await expect(
        watch(
          {
            ...globalConfig,
            rootDir: __dirname,
            watchPlugins: pluginPaths.map(path => ({config: {}, path})),
          },
          contexts,
          pipe,
          hasteMapInstances,
          stdin,
        ),
      ).rejects.toThrowError(
        /Watch plugins OffendingFooThirdPartyWatchPlugin and OffendingBarThirdPartyWatchPlugin both attempted to register key <!>\.\s+Please change the key configuration for one of the conflicting plugins to avoid overlap\./m,
      );
    });
  });

  it('allows WatchPlugins to be configured', async () => {
    const pluginPath = `${__dirname}/__fixtures__/plugin_path_with_config`;
    elric.doMock(
      pluginPath,
      () =>
        class WatchPlugin {
          constructor({config}) {
            this._key = config.key;
            this._prompt = config.prompt;
          }
          onKey() {}
          run() {}
          getUsageInfo() {
            return {
              key: this._key || 'z',
              prompt: this._prompt || 'default prompt',
            };
          }
        },
      {virtual: true},
    );

    await watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [
          {
            config: {key: 'k', prompt: 'filter with a custom prompt'},
            path: pluginPath,
          },
        ],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    expect(pipe.write.mock.calls.reverse()[0]).toMatchSnapshot();
  });

  it('allows WatchPlugins to hook into file system changes', async () => {
    const onFileChange = elric.fn();
    const pluginPath = `${__dirname}/__fixtures__/plugin_path_fs_change`;
    elric.doMock(
      pluginPath,
      () =>
        class WatchPlugin {
          apply(elricHooks) {
            elricHooks.onFileChange(onFileChange);
          }
        },
      {virtual: true},
    );

    await watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [{config: {}, path: pluginPath}],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    expect(onFileChange).toHaveBeenCalledWith({
      projects: [
        {
          config: contexts[0].config,
          testPaths: ['./path/to/file1-test.js', './path/to/file2-test.js'],
        },
      ],
    });
  });

  it('makes watch plugin initialization errors look nice', async () => {
    const pluginPath = `${__dirname}/__fixtures__/watchPluginThrows`;

    await expect(
      watch(
        {
          ...globalConfig,
          rootDir: __dirname,
          watchPlugins: [{config: {}, path: pluginPath}],
        },
        contexts,
        pipe,
        hasteMapInstances,
        stdin,
      ),
    ).rejects.toMatchSnapshot();
  });

  it.each`
    ok      | option
    ${'✔︎'} | ${'bail'}
    ${'✖︎'} | ${'changedFilesWithAncestor'}
    ${'✔︎'} | ${'changedSince'}
    ${'✔︎'} | ${'collectCoverage'}
    ${'✔︎'} | ${'collectCoverageFrom'}
    ${'✔︎'} | ${'collectCoverageOnlyFrom'}
    ${'✔︎'} | ${'coverageDirectory'}
    ${'✔︎'} | ${'coverageReporters'}
    ${'✖︎'} | ${'coverageThreshold'}
    ${'✖︎'} | ${'detectLeaks'}
    ${'✖︎'} | ${'detectOpenHandles'}
    ${'✖︎'} | ${'errorOnDeprecated'}
    ${'✖︎'} | ${'expand'}
    ${'✖︎'} | ${'filter'}
    ${'✔︎'} | ${'findRelatedTests'}
    ${'✖︎'} | ${'forceExit'}
    ${'✖︎'} | ${'globalSetup'}
    ${'✖︎'} | ${'globalTeardown'}
    ${'✖︎'} | ${'json'}
    ${'✖︎'} | ${'lastCommit'}
    ${'✖︎'} | ${'listTests'}
    ${'✖︎'} | ${'logHeapUsage'}
    ${'✖︎'} | ${'maxWorkers'}
    ${'✔︎'} | ${'nonFlagArgs'}
    ${'✖︎'} | ${'noSCM'}
    ${'✖︎'} | ${'noStackTrace'}
    ${'✔︎'} | ${'notify'}
    ${'✔︎'} | ${'notifyMode'}
    ${'✖︎'} | ${'onlyChanged'}
    ${'✔︎'} | ${'onlyFailures'}
    ${'✖︎'} | ${'outputFile'}
    ${'✖︎'} | ${'passWithNoTests'}
    ${'✖︎'} | ${'projects'}
    ${'✖︎'} | ${'replname'}
    ${'✔︎'} | ${'reporters'}
    ${'✖︎'} | ${'rootDir'}
    ${'✖︎'} | ${'runTestsByPath'}
    ${'✖︎'} | ${'silent'}
    ${'✖︎'} | ${'skipFilter'}
    ${'✖︎'} | ${'testFailureExitCode'}
    ${'✔︎'} | ${'testNamePattern'}
    ${'✔︎'} | ${'testPathPattern'}
    ${'✖︎'} | ${'testResultsProcessor'}
    ${'✔︎'} | ${'updateSnapshot'}
    ${'✖︎'} | ${'useStderr'}
    ${'✔︎'} | ${'verbose'}
    ${'✖︎'} | ${'watch'}
    ${'✖︎'} | ${'watchAll'}
    ${'✖︎'} | ${'watchman'}
    ${'✖︎'} | ${'watchPlugins'}
  `(
    'allows WatchPlugins to modify only white-listed global config keys',
    async ({ok, option}) => {
      ok = ok === '✔︎';
      const pluginPath = `${__dirname}/__fixtures__/plugin_path_config_updater_${option}`;

      elric.doMock(
        pluginPath,
        () =>
          class WatchPlugin {
            getUsageInfo() {
              return {key: 'x', prompt: 'test option white-listing'};
            }

            run(globalConfig, updateConfigAndRun) {
              updateConfigAndRun({[option]: '__JUST_TRYING__'});
              return Promise.resolve();
            }
          },
        {virtual: true},
      );

      const config = {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [{config: {}, path: pluginPath}],
      };

      watch(config, contexts, pipe, hasteMapInstances, stdin);
      await nextTick();

      stdin.emit('x');
      await nextTick();

      // We need the penultimate call as elric forces a final call to restore
      // updateSnapshot because it's not sticky after a run…?
      const lastCall = updateGlobalConfig.mock.calls.slice(-2)[0];
      let expector = expect(lastCall[1]);
      if (!ok) {
        expector = expector.not;
      }
      expector.toHaveProperty(option, '__JUST_TRYING__');
    },
  );

  it('triggers enter on a WatchPlugin when its key is pressed', async () => {
    const run = elric.fn(() => Promise.resolve());
    const pluginPath = `${__dirname}/__fixtures__/plugin_path`;
    elric.doMock(
      pluginPath,
      () =>
        class WatchPlugin1 {
          constructor() {
            this.run = run;
          }
          getUsageInfo() {
            return {
              key: 's',
              prompt: 'do nothing',
            };
          }
        },
      {virtual: true},
    );

    await watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [{config: {}, path: pluginPath}],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    stdin.emit('s');

    await nextTick();

    expect(run).toHaveBeenCalled();
  });

  it('prevents elric from handling keys when active and returns control when end is called', async () => {
    let resolveShowPrompt;
    const run = elric.fn(() => new Promise(res => (resolveShowPrompt = res)));
    const pluginPath = `${__dirname}/__fixtures__/plugin_path_1`;
    elric.doMock(
      pluginPath,
      () =>
        class WatchPlugin1 {
          constructor() {
            this.run = run;
          }
          onKey() {}
          getUsageInfo() {
            return {
              key: 's',
              prompt: 'do nothing',
            };
          }
        },
      {virtual: true},
    );

    const showPrompt2 = elric.fn(() => Promise.resolve());
    const pluginPath2 = `${__dirname}/__fixtures__/plugin_path_2`;
    elric.doMock(
      pluginPath2,
      () =>
        class WatchPlugin1 {
          constructor() {
            this.run = showPrompt2;
          }
          onKey() {}
          getUsageInfo() {
            return {
              key: 'z',
              prompt: 'also do nothing',
            };
          }
        },
      {virtual: true},
    );

    await watch(
      {
        ...globalConfig,
        rootDir: __dirname,
        watchPlugins: [
          {config: {}, path: pluginPath},
          {config: {}, path: pluginPath2},
        ],
      },
      contexts,
      pipe,
      hasteMapInstances,
      stdin,
    );

    stdin.emit('s');
    await nextTick();
    expect(run).toHaveBeenCalled();
    stdin.emit('z');
    await nextTick();
    expect(showPrompt2).not.toHaveBeenCalled();
    await resolveShowPrompt();
    stdin.emit('z');
    expect(showPrompt2).toHaveBeenCalled();
  });

  it('Pressing "o" runs test in "only changed files" mode', () => {
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);
    runelricMock.mockReset();

    stdin.emit('o');

    expect(runelricMock).toBeCalled();
    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      onlyChanged: true,
      watch: true,
      watchAll: false,
    });
  });

  it('Pressing "a" runs test in "watch all" mode', () => {
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);
    runelricMock.mockReset();

    stdin.emit('a');

    expect(runelricMock).toBeCalled();
    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      onlyChanged: false,
      watch: false,
      watchAll: true,
    });
  });

  it('Pressing "ENTER" reruns the tests', () => {
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);
    expect(runelricMock).toHaveBeenCalledTimes(1);
    stdin.emit(KEYS.ENTER);
    expect(runelricMock).toHaveBeenCalledTimes(2);
  });

  it('Pressing "t" reruns the tests in "test name pattern" mode', async () => {
    const hooks = new elricHook();

    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin, hooks);
    runelricMock.mockReset();

    stdin.emit('t');
    ['t', 'e', 's', 't'].forEach(key => stdin.emit(key));
    stdin.emit(KEYS.ENTER);
    await nextTick();

    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      testNamePattern: 'test',
      watch: true,
      watchAll: false,
    });
  });

  it('Pressing "p" reruns the tests in "filename pattern" mode', async () => {
    const hooks = new elricHook();

    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin, hooks);
    runelricMock.mockReset();

    stdin.emit('p');
    ['f', 'i', 'l', 'e'].forEach(key => stdin.emit(key));
    stdin.emit(KEYS.ENTER);
    await nextTick();

    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      testPathPattern: 'file',
      watch: true,
      watchAll: false,
    });
  });

  it('Can combine "p" and "t" filters', async () => {
    const hooks = new elricHook();

    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin, hooks);
    runelricMock.mockReset();

    stdin.emit('p');
    ['f', 'i', 'l', 'e'].forEach(key => stdin.emit(key));
    stdin.emit(KEYS.ENTER);
    await nextTick();

    stdin.emit('t');
    ['t', 'e', 's', 't'].forEach(key => stdin.emit(key));
    stdin.emit(KEYS.ENTER);
    await nextTick();

    expect(runelricMock.mock.calls[1][0].globalConfig).toMatchObject({
      testNamePattern: 'test',
      testPathPattern: 'file',
      watch: true,
      watchAll: false,
    });
  });

  it('Pressing "u" reruns the tests in "update snapshot" mode', async () => {
    const hooks = new elricHook();

    globalConfig.updateSnapshot = 'new';

    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin, hooks);
    runelricMock.mockReset();

    hooks.getEmitter().onTestRunComplete({snapshot: {failure: true}});

    stdin.emit('u');
    await nextTick();

    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      updateSnapshot: 'all',
      watch: true,
      watchAll: false,
    });

    stdin.emit('a');

    await nextTick();
    // updateSnapshot is not sticky after a run.
    expect(runelricMock.mock.calls[1][0].globalConfig).toMatchObject({
      updateSnapshot: 'new',
      watch: false,
      watchAll: true,
    });

    results = {snapshot: {failure: true}};

    stdin.emit('a');
    await nextTick();

    runelricMock.mockReset();
    stdin.emit('u');
    await nextTick();

    expect(runelricMock.mock.calls[0][0].globalConfig).toMatchObject({
      updateSnapshot: 'all',
      watch: false,
      watchAll: true,
    });
  });

  it('passWithNoTest should be set to true in watch mode', () => {
    globalConfig.passWithNoTests = false;
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);
    globalConfig.passWithNoTests = true;
    expect(runelricMock.mock.calls[0][0]).toMatchObject({
      globalConfig,
    });
  });

  it('shows the correct usage for the f key in "only failed tests" mode', () => {
    watch(globalConfig, contexts, pipe, hasteMapInstances, stdin);

    stdin.emit('f');
    stdin.emit('w');

    const lastWatchDisplay = pipe.write.mock.calls.reverse()[0][0];
    expect(lastWatchDisplay).toMatch('Press a to run all tests.');
    expect(lastWatchDisplay).toMatch(
      'Press f to quit "only failed tests" mode',
    );
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
