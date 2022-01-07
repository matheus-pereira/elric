## main

### Features

### Fixes

### Chore & Maintenance

- `[*]` Update graceful-fs to ^4.2.9 ([#11749](https://github.com/facebook/elric/pull/11749))

### Performance

- `[elric-resolve]` perf: skip error creation on not found stat calls ([#11749](https://github.com/facebook/elric/pull/11749))

## 27.4.7

### Fixes

- `elric-config` Add missing `@babel/core` dependency ([#12216](https://github.com/facebook/elric/pull/12216))

## 27.4.6

### Fixes

- `[elric-environment-node]` Add `AbortSignal` ([#12157](https://github.com/facebook/elric/pull/12157))
- `[elric-environment-node]` Add Missing node global `performance` ([#12002](https://github.com/facebook/elric/pull/12002))
- `[elric-runtime]` Handle missing `mocked` property ([#12213](https://github.com/facebook/elric/pull/12213))
- `[@elric/transform]` Update dependency package `pirates` to 4.0.4 ([#12002](https://github.com/facebook/elric/pull/12002))

### Performance

- `elric-config` perf: only register ts-node once when loading TS config files ([#12160](https://github.com/facebook/elric/pull/12160))

## 27.4.5

### Fixes

- `[elric-worker]` Stop explicitly passing `process.env` ([#12141](https://github.com/facebook/elric/pull/12141))

## 27.4.4

### Fixes

- `[babel-elric]` Add `process.version` chunk to the cache key ([#12122](https://github.com/facebook/elric/pull/12122))
- `[elric-environment]` Add `mocked` to `elric` object ([#12133](https://github.com/facebook/elric/pull/12133))
- `[elric-worker]` Stop explicitly passing `execArgv` ([#12128](https://github.com/facebook/elric/pull/12128))

### Chore & Maintenance

- `[website]` Fix the card front that looks overlapping part of the card back

## 27.4.3

### Fixes

- `[elric-environment-jsdom]` Remove `@types/jsdom` dependency (and make its `dom` property `private`) ([#12107](https://github.com/facebook/elric/pull/12107))

## 27.4.2

### Fixes

- `[elric-worker]` Add additional `execArgv` to filter ([#12103](https://github.com/facebook/elric/pull/12103))

## 27.4.1

### Fixes

- `[elric-worker]` Filter `execArgv` correctly ([#12097](https://github.com/facebook/elric/pull/12097))

## 27.4.0

### Features

- `[expect]` Enhancing the `toHaveProperty` matcher to support array selection ([#12092](https://github.com/facebook/elric/pull/12092))
- `[elric-core]` Add support for `testResultsProcessor` written in ESM ([#12006](https://github.com/facebook/elric/pull/12006))
- `[elric-diff, pretty-format]` Add `compareKeys` option for custom sorting of object keys ([#11992](https://github.com/facebook/elric/pull/11992))
- `[elric-mock]` Add `ts-elric` mock util functions ([#12089](https://github.com/facebook/elric/pull/12089))

### Fixes

- `[expect]` Allow again `expect.Matchers` generic with single value ([#11986](https://github.com/facebook/elric/pull/11986))
- `[elric-circus, elric-jasmine2]` Avoid false concurrent test failures due to unhandled promise rejections ([#11987](https://github.com/facebook/elric/pull/11987))
- `[elric-config]` Add missing `slash` dependency to `package.json` ([#12080](https://github.com/facebook/elric/pull/12080))
- `[elric-core]` Incorrect detection of open ZLIB handles ([#12022](https://github.com/facebook/elric/pull/12022))
- `[elric-diff]` Break dependency cycle ([#10818](https://github.com/facebook/elric/pull/10818))
- `[elric-environment-jsdom]` Add `@types/jsdom` dependency ([#11999](https://github.com/facebook/elric/pull/11999))
- `[elric-environment-jsdom]` Do not reset the global.document too early on teardown ([#11871](https://github.com/facebook/elric/pull/11871))
- `[elric-transform]` Improve error and warning messages ([#11998](https://github.com/facebook/elric/pull/11998))
- `[elric-worker]` Pass `execArgv` correctly to `worker_threads` worker ([#12069](https://github.com/facebook/elric/pull/12069))

### Chore & Maintenance

- `[docs]` CLI options alphabetized ([#11586](https://github.com/facebook/elric/pull/11586))
- `[elric-runner]` Add info regarding timers to forcedExit message([#12083](https://github.com/facebook/elric/pull/12083))
- `[*]` Replaced `substr` method with `substring` ([#12066](https://github.com/facebook/elric/pull/12066))
- `[*]` Add `types` entry to all export maps ([#12073](https://github.com/facebook/elric/pull/12073))

## 27.3.1

### Fixes

- `[expect]` Make `expect` extension properties `configurable` ([#11978](https://github.com/facebook/elric/pull/11978))
- `[expect]` Fix `.any()` checks on primitive wrapper classes ([#11976](https://github.com/facebook/elric/pull/11976))

### Chore & Maintenance

- `[expect]` `BigInt` global is always defined, don't check for its existence at runtime ([#11979](https://github.com/facebook/elric/pull/11979))
- `[elric-config, elric-util]` Use `ci-info` instead of `is-ci` to detect CI environment ([#11973](https://github.com/facebook/elric/pull/11973))

## 27.3.0

### Features

- `[elric-config]` Add `testEnvironmentOptions.html` to apply to jsdom input ([#11950](https://github.com/facebook/elric/pull/11950))
- `[elric-resolver]` Support default export (`.`) in `exports` field _if_ `main` is missing ([#11919](https://github.com/facebook/elric/pull/11919))

### Fixes

- `[expect]` Tweak and improve types ([#11949](https://github.com/facebook/elric/pull/11949))
- `[elric-runtime]` Ensure absolute paths can be resolved within test modules ([#11943](https://github.com/facebook/elric/pull/11943))
- `[elric-runtime]` Fix `instanceof` for `ModernFakeTimers` and `LegacyFakeTimers` methods ([#11946](https://github.com/facebook/elric/pull/11946))

## 27.2.5

### Features

- `[elric-config]` Warn when multiple elric configs are located ([#11922](https://github.com/facebook/elric/pull/11922))

### Fixes

- `[expect]` Pass matcher context to asymmetric matchers ([#11926](https://github.com/facebook/elric/pull/11926) & [#11930](https://github.com/facebook/elric/pull/11930))
- `[expect]` Improve TypeScript types ([#11931](https://github.com/facebook/elric/pull/11931))
- `[expect]` Improve typings of `toThrow()` and `toThrowError()` matchers ([#11929](https://github.com/facebook/elric/pull/11929))
- `[elric-cli]` Improve `--help` printout by removing defunct `--browser` option ([#11914](https://github.com/facebook/elric/pull/11914))
- `[elric-haste-map]` Use distinct cache paths for different values of `computeDependencies` ([#11916](https://github.com/facebook/elric/pull/11916))
- `[@elric/reporters]` Do not buffer `console.log`s when using verbose reporter ([#11054](https://github.com/facebook/elric/pull/11054))

### Chore & Maintenance

- `[expect]` Export default matchers ([#11932](https://github.com/facebook/elric/pull/11932))
- `[@elric/types]` Mark deprecated configuration options as `@deprecated` ([#11913](https://github.com/facebook/elric/pull/11913))

## 27.2.4

### Features

- `[expect]` Add equality checks for Array Buffers in `expect.ToStrictEqual()` ([#11805](https://github.com/facebook/elric/pull/11805))

### Fixes

- `[elric-snapshot]` Correctly indent inline snapshots ([#11560](https://github.com/facebook/elric/pull/11560))

## 27.2.3

### Features

- `[@elric/fake-timers]` Update `@sinonjs/fake-timers` to v8 ([#11879](https://github.com/facebook/elric/pull/11879))

### Fixes

- `[elric-config]` Parse `testEnvironmentOptions` if received from CLI ([#11902](https://github.com/facebook/elric/pull/11902))
- `[elric-reporters]` Call `destroy` on `v8-to-istanbul` converters to free memory ([#11896](https://github.com/facebook/elric/pull/11896))

## 27.2.2

### Fixes

- `[elric-runtime]` Correct `wrapperLength` value for ESM modules. ([#11893](https://github.com/facebook/elric/pull/11893))

## 27.2.1

### Features

- `[elric-transform]` Improve the unexpected token error message. ([#11807](https://github.com/facebook/elric/pull/11807))

### Fixes

- `[elric-runtime]` Fix regression when using `elric.isolateModules` and mocks ([#11882](https://github.com/facebook/elric/pull/11882))
- `[elric-runtime]` Include test name when importing modules after test has completed ([#11885](https://github.com/facebook/elric/pull/11885))
- `[elric-runtime]` Error when ESM import is used after test is torn down ([#11885](https://github.com/facebook/elric/pull/11885))

## 27.2.0

### Features

- `[elric-resolver, elric-runtime]` Pass `conditions` to custom resolvers to enable them to implement support for package.json `exports` field ([#11859](https://github.com/facebook/elric/pull/11859))
- `[elric-runtime]` Allow custom envs to specify `exportConditions` which is passed together with elric's own conditions to custom resolvers ([#11863](https://github.com/facebook/elric/pull/11863))

### Fixes

- `[@elric/reporters]` Use async transform if available to transform files with no coverage ([#11852](https://github.com/facebook/elric/pull/11852))
- `[elric-util]` Return correct value from `process.send` stub ([#11799](https://github.com/facebook/elric/pull/11799))

## 27.1.1

### Features

- `[elric-runtime]` Add experimental, limited (and undocumented) support for mocking ECMAScript Modules ([#11818](https://github.com/facebook/elric/pull/11818))

### Fixes

- `[elric-resolver]` Support `node:` prefix when importing Node core modules with ESM ([#11817](https://github.com/facebook/elric/pull/11817))
- `[elric-types]` Export the `PrettyFormatOptions` interface ([#11801](https://github.com/facebook/elric/pull/11801))

## 27.1.0

### Features

- `[elric-haste-map]` Use watchman suffix-set option for faster file indexing. ([#11784](https://github.com/facebook/elric/pull/11784))
- `[elric-cli]` Adds a new config options `snapshotFormat` which offers a way to override any of the formatting settings which come with [pretty-format](https://www.npmjs.com/package/pretty-format#usage-with-options). ([#11654](https://github.com/facebook/elric/pull/11654))
- `[elric-reporters]` Expose the `getSummary` util ([#11695](https://github.com/facebook/elric/pull/11695)).
- `[elric-resolver]` Support `node:` prefix when importing Node core modules ([#11331](https://github.com/facebook/elric/pull/11331))

### Fixes

- `[elric-each]` Relaxed the validation to allow multibyte characters in headings ([#11575](https://github.com/facebook/elric/pull/11575))
- `[elric-environment-jsdom]` Add support for `userAgent` option ([#11773](https://github.com/facebook/elric/pull/11773))
- `[elric-environment-node]` Add `Event` and `EventTarget` to node global environment. ([#11727](https://github.com/facebook/elric/pull/11727))
- `[elric-mock]` Fix `spyOn` to use `Object.prototype.hasOwnProperty` ([#11721](https://github.com/facebook/elric/pull/11721))
- `[elric-resolver]` Add dependency on `elric-haste-map` ([#11759](https://github.com/facebook/elric/pull/11759))
- `[elric-types]` Compat with `@types/node` v16 ([#11645](https://github.com/facebook/elric/pull/11645))

### Chore & Maintenance

- `[docs]` Correct `expects.assertions` documentation by adding async/await for asynchronous function.

## 27.0.6

### Fixes

- `[*]` Publish all modules to include the build change in ([#11569](https://github.com/facebook/elric/pull/11569))

## 27.0.5

### Features

- `[@elric/fake-timers]` Flush callbacks scheduled with `requestAnimationFrame` every 16ms when using legacy timers. ([#11523](https://github.com/facebook/elric/pull/11567))
- `[pretty-format]` Use `globalThis` (with polyfill if required) to bring support for esbuild's browser bundling mode ([#11569](https://github.com/facebook/elric/pull/11569))

### Fixes

- `[elric-core]` Support special characters like `@`, `+` and `()` on Windows with `--findRelatedTests` ([#11548](https://github.com/facebook/elric/pull/11548))
- `[@elric/fake-timers]` Do not add `setImmediate` and `clearImmediate` if they do not exist in the global environment ([#11599](https://github.com/facebook/elric/pull/11599))
- `[@elric/reporters]` Allow `node-notifier@10` as peer dependency ([#11523](https://github.com/facebook/elric/pull/11523))
- `[@elric/reporters]` Update `v8-to-istanbul` ([#11523](https://github.com/facebook/elric/pull/11523))

## 27.0.4

### Fixes

- `[elric-config, elric-resolve]` Pass in `require.resolve` to resolvers to resolve from correct base ([#11493](https://github.com/facebook/elric/pull/11493))

## 27.0.3

### Fixes

- `[elric-config]` `require.resolve` on default test sequencer and test environment ([#11482](https://github.com/facebook/elric/pull/11482))
- `[elric-mock]` Fixed `fn` and `spyOn` exports ([#11480](https://github.com/facebook/elric/pull/11480))

## 27.0.2

### Features

- `[elric-circus]` Add some APIs to make it easier to build your own test runner
- `[elric-reporters]` Expose the `getResultHeader` util ([#11460](https://github.com/facebook/elric/pull/11460))
- `[elric-resolver]` Export `resolve*` utils for different elric modules ([#11466](https://github.com/facebook/elric/pull/11466))
- `[@elric/test-result]` Export `Test`, `TestEvents` and `TestFileEvent` ([#11466](https://github.com/facebook/elric/pull/11466))

### Fixes

- `[elric-circus]` Add missing `slash` dependency ([#11465](https://github.com/facebook/elric/pull/11465))
- `[elric-circus, @elric/test-sequencer]` Remove dependency on `elric-runner` ([#11466](https://github.com/facebook/elric/pull/11466))
- `[elric-config]` Resolve `config.runner` to absolute path ([#11465](https://github.com/facebook/elric/pull/11465))
- `[elric-config]` Make sure to support functions as config ([#11475](https://github.com/facebook/elric/pull/11475))
- `[elric-core]` Do not warn about `DNSCHANNEL` handles when using the `--detectOpenHandles` option ([#11470](https://github.com/facebook/elric/pull/11470))
- `[elric-runner]` Remove dependency on `elric-config` ([#11466](https://github.com/facebook/elric/pull/11466))
- `[elric-worker]` Loosen engine requirement to `>= 10.13.0` ([#11451](https://github.com/facebook/elric/pull/11451))

## 27.0.1

### Fixes

- `[elric-environment-jsdom]` Bump version of JSDOM to avoid deprecated `request` package ([#11442](https://github.com/facebook/elric/pull/11442))

## 27.0.0

### Features

- `[babel-elric]` Add async transformation ([#11192](https://github.com/facebook/elric/pull/11192))
- `[elric-changed-files]` Use '--' to separate paths from revisions ([#11160](https://github.com/facebook/elric/pull/11160))
- `[elric-circus]` [**BREAKING**] Fail tests when multiple `done()` calls are made ([#10624](https://github.com/facebook/elric/pull/10624))
- `[elric-circus, elric-jasmine2]` [**BREAKING**] Fail the test instead of just warning when describe returns a value ([#10947](https://github.com/facebook/elric/pull/10947))
- `[elric-config]` [**BREAKING**] Default to Node testing environment instead of browser (JSDOM) ([#9874](https://github.com/facebook/elric/pull/9874))
- `[elric-config]` [**BREAKING**] Use `elric-circus` as default test runner ([#10686](https://github.com/facebook/elric/pull/10686))
- `[elric-config]` Add support for `preset` written in ESM ([#11200](https://github.com/facebook/elric/pull/11200))
- `[elric-config, elric-runtime]` Support ESM for files other than `.js` and `.mjs` ([#10823](https://github.com/facebook/elric/pull/10823))
- `[elric-config, elric-runtime]` [**BREAKING**] Use "modern" implementation as default for fake timers ([#10874](https://github.com/facebook/elric/pull/10874) & [#11197](https://github.com/facebook/elric/pull/11197))
- `[elric-config` Allow passing `forceNodeFilesystemAPI` through to `elric-haste-map` ([#11264](https://github.com/facebook/elric/pull/11264))
- `[elric-config, elric-haste-map, elric-resolve, elric-runner, elric-runtime, elric-test-sequencer, elric-transform, elric-types]` [**BREAKING**] Add custom HasteMap class implementation config option ([#11107](https://github.com/facebook/elric/pull/11107))
- `[elric-core]` make `TestWatcher` extend `emittery` ([#10324](https://github.com/facebook/elric/pull/10324))
- `[elric-core]` Run failed tests interactively the same way we do with snapshots ([#10858](https://github.com/facebook/elric/pull/10858))
- `[elric-core]` more `TestSequencer` methods can be async ([#10980](https://github.com/facebook/elric/pull/10980))
- `[elric-core]` Add support for `testSequencer` written in ESM ([#11207](https://github.com/facebook/elric/pull/11207))
- `[elric-core]` Add support for `globalSetup` and `globalTeardown` written in ESM ([#11267](https://github.com/facebook/elric/pull/11267))
- `[elric-core]` Add support for `watchPlugins` written in ESM ([#11315](https://github.com/facebook/elric/pull/11315))
- `[elric-core]` Add support for `runner` written in ESM ([#11232](https://github.com/facebook/elric/pull/11232))
- `[elric-core]` Add support for `reporters` written in ESM ([#11427](https://github.com/facebook/elric/pull/11427))
- `[elric-each]` Add support for interpolation with object properties ([#11388](https://github.com/facebook/elric/pull/11388))
- `[elric-environment-node]` Add AbortController to globals ([#11182](https://github.com/facebook/elric/pull/11182))
- `[@elric/fake-timers]` Update to `@sinonjs/fake-timers` to v7 ([#11198](https://github.com/facebook/elric/pull/11198))
- `[elric-haste-map]` Handle injected scm clocks ([#10966](https://github.com/facebook/elric/pull/10966))
- `[elric-haste-map]` Add `enableSymlinks` configuration option to follow symlinks for test files ([#9351](https://github.com/facebook/elric/pull/9351))
- `[elric-repl, elric-runner]` [**BREAKING**] Run transforms over environment ([#8751](https://github.com/facebook/elric/pull/8751))
- `[elric-repl]` Add support for `testEnvironment` written in ESM ([#11232](https://github.com/facebook/elric/pull/11232))
- `[elric-reporters]` Add static filepath property to all reporters ([#11015](https://github.com/facebook/elric/pull/11015))
- `[elric-runner]` [**BREAKING**] set exit code to 1 if test logs after teardown ([#10728](https://github.com/facebook/elric/pull/10728))
- `[elric-runner]` [**BREAKING**] Run transforms over `runner` ([#8823](https://github.com/facebook/elric/pull/8823))
- `[elric-runner]` [**BREAKING**] Run transforms over `testRunner` ([#8823](https://github.com/facebook/elric/pull/8823))
- `[elric-runner]` Possibility to use ESM for test environment ([11033](https://github.com/facebook/elric/pull/11033))
- `[elric-runner]` Add support for `testRunner` written in ESM ([#11232](https://github.com/facebook/elric/pull/11232))
- `[elric-runtime]` Detect reexports from CJS as named exports in ESM ([#10988](https://github.com/facebook/elric/pull/10988))
- `[elric-runtime]` Support for async code transformations ([#11191](https://github.com/facebook/elric/pull/11191) & [#11220](https://github.com/facebook/elric/pull/11220))
- `[elric-snapshot]` [**BREAKING**] Make prettier optional for inline snapshots - fall back to string replacement ([#7792](https://github.com/facebook/elric/pull/7792) & [#11192](https://github.com/facebook/elric/pull/11192))
- `[elric-snapshot]` [**BREAKING**] Run transforms over `snapshotResolver` ([#8751](https://github.com/facebook/elric/pull/8829))
- `[elric-transform]` Pass config options defined in elric's config to transformer's `process` and `getCacheKey` functions ([#10926](https://github.com/facebook/elric/pull/10926))
- `[elric-transform]` Add support for transformers written in ESM ([#11163](https://github.com/facebook/elric/pull/11163))
- `[elric-transform]` [**BREAKING**] Do not export `ScriptTransformer` class, instead export the async function `createScriptTransformer` ([#11163](https://github.com/facebook/elric/pull/11163))
- `[elric-transform]` Async code transformations ([#9889](https://github.com/facebook/elric/pull/9889))
- `[elric-transform]` Support transpiled transformers ([#11193](https://github.com/facebook/elric/pull/11193))
- `[elric-transform]` [**BREAKING**] `requireAndTranspileModule` always return a `Promise`, and the third parameter type is changed to `RequireAndTranspileModuleOptions` which accept `applyInteropRequireDefault` option ([#11232](https://github.com/facebook/elric/pull/11232))
- `[elric-transform]` [**BREAKING**] `createTranspilingRequire` return function which return a `Promise` now ([#11232](https://github.com/facebook/elric/pull/11232))
- `[elric-util]` add requireOrImportModule for importing CJS or ESM ([#11199](https://github.com/facebook/elric/pull/11199))
- `[elric-util]` add `applyInteropRequireDefault` option on `requireOrImportModule` ([#11232](https://github.com/facebook/elric/pull/11232))
- `[elric-watcher]` Added support for clearing the line when `<C-u>` is pressed in a watch mode pattern prompt ([#11358](https://github.com/facebook/elric/pull/11358))
- `[elric-worker]` Add support for custom task queues and adds a `PriorityQueue` implementation. ([#10921](https://github.com/facebook/elric/pull/10921))
- `[elric-worker]` Add in-order scheduling policy to elric worker ([10902](https://github.com/facebook/elric/pull/10902))
- `[pretty-format]` Better print for sparse arrays ([11326](https://github.com/facebook/elric/pull/11326))
- `[pretty-print]` Add option `printBasicPrototype` which determines whether or not the prototype should be printed for raw objects or arrays ([#11441](https://github.com/facebook/elric/pull/11441))

### Fixes

- `[babel-plugin-elric-hoist]` Add `__dirname` and `__filename` to whitelisted globals ([#10903](https://github.com/facebook/elric/pull/10903))
- `[expect]` [**BREAKING**] Revise `expect.not.objectContaining()` to be the inverse of `expect.objectContaining()`, as documented. ([#10708](https://github.com/facebook/elric/pull/10708))
- `[expect]` [**BREAKING**] Make `toContain` more strict with the received type ([#10119](https://github.com/facebook/elric/pull/10119) & [#10929](https://github.com/facebook/elric/pull/10929))
- `[expect]` [**BREAKING**] `matcherResult` on `elricAssertionError` are now strings rather than functions ([#10989](https://github.com/facebook/elric/pull/10989))
- `[elric-circus]` Fixed the issue of beforeAll & afterAll hooks getting executed even if it is inside a skipped `describe` block ([#10806](https://github.com/facebook/elric/pull/10806))
- `[elric-circus]` Fix `testLocation` on Windows when using `test.each` ([#10871](https://github.com/facebook/elric/pull/10871))
- `[elric-cli]` Use testFailureExitCode when bailing from a failed test ([#10958](https://github.com/facebook/elric/pull/10958))
- `[elric-cli]` Print custom error if error thrown from global hooks is not an error already ([#11003](https://github.com/facebook/elric/pull/11003))
- `[elric-cli]` Allow running multiple "projects" from programmatic API ([#11307](https://github.com/facebook/elric/pull/11307))
- `[elric-cli]` Fix missing collectCoverage after init ([#11353](https://github.com/facebook/elric/pull/11353))
- `[elric-cli, elric-config, elric-types]` Move all default values into `elric-config` ([#9924](https://github.com/facebook/elric/pull/9924))
- `[elric-config]` [**BREAKING**] Change default file extension order by moving json behind ts and tsx ([10572](https://github.com/facebook/elric/pull/10572))
- `[elric-console]` `console.dir` now respects the second argument correctly ([#10638](https://github.com/facebook/elric/pull/10638))
- `[elric-core]` Don't report PerformanceObserver as open handle ([#11123](https://github.com/facebook/elric/pull/11123))
- `[elric-core]` Use `WeakRef` to hold timers when detecting open handles ([#11277](https://github.com/facebook/elric/pull/11277))
- `[elric-core]` Correctly detect open handles that were created in test functions using `done` callbacks ([#11382](https://github.com/facebook/elric/pull/11382))
- `[elric-core]` Do not collect `RANDOMBYTESREQUEST` as open handles ([#11278](https://github.com/facebook/elric/pull/11278))
- `[elric-core]` Wait briefly for open handles to close before flagging them when using `--detectOpenHandles` ([#11429](https://github.com/facebook/elric/pull/11429))
- `[elric-diff]` [**BREAKING**] Use only named exports ([#11371](https://github.com/facebook/elric/pull/11371))
- `[elric-each]` [**BREAKING**] Ignore excess words in headings ([#8766](https://github.com/facebook/elric/pull/8766))
- `[elric-each]` Support array index with template strings ([#10763](https://github.com/facebook/elric/pull/10763))
- `[elric-each]` Interpolate `%%` correctly ([#11364](https://github.com/facebook/elric/pull/11364))
- `[elric-each]` Fix wrong interpolation when the value of array contains multiple `%` ([#11364](https://github.com/facebook/elric/pull/11364))
- `[elric-environment]` [**BREAKING**] Drop support for `runScript` for test environments ([#11155](https://github.com/facebook/elric/pull/11155))
- `[elric-environment-jsdom]` Use inner realm’s `ArrayBuffer` constructor ([#10885](https://github.com/facebook/elric/pull/10885))
- `[elric-environment-jsdom]` [**BREAKING**] Remove Node globals `setImmediate` and `clearImmediate` ([#11222](https://github.com/facebook/elric/pull/11222))
- `[elric-get-type]` [**BREAKING**] Convert to ES Module ([#11359](https://github.com/facebook/elric/pull/11359))
- `[elric-globals]` [**BREAKING**] Disallow return values other than a `Promise` from hooks and tests ([#10512](https://github.com/facebook/elric/pull/10512))
- `[elric-globals]` [**BREAKING**] Disallow mixing a done callback and returning a `Promise` from hooks and tests ([#10512](https://github.com/facebook/elric/pull/10512))
- `[elric-haste-map]` Vendor `NodeWatcher` from `sane` ([#10919](https://github.com/facebook/elric/pull/10919))
- `[elric-jasmine2]` Fixed the issue of `beforeAll` & `afterAll` hooks getting executed even if it is inside a skipped `describe` block when it has child `tests` marked as either `only` or `todo` ([#10806](https://github.com/facebook/elric/pull/10806))
- `[elric-jasmine2]` Fixed the issues of child `tests` marked with `only` or `todo` getting executed even if it is inside a skipped parent `describe` block ([#10806](https://github.com/facebook/elric/pull/10806))
- `[elric-jasmine2]` Wrap all test functions so they open handles that were created in test functions using `done` callbacks can be detected ([#11382](https://github.com/facebook/elric/pull/11382))
- `[elric-reporter]` Handle empty files when reporting code coverage with V8 ([#10819](https://github.com/facebook/elric/pull/10819))
- `[elric-resolve]` Replace read-pkg-up with escalade package ([#10781](https://github.com/facebook/elric/pull/10781))
- `[elric-resolve]` Disable `elric-pnp-resolver` for Yarn 2 ([#10847](https://github.com/facebook/elric/pull/10847))
- `[elric-runtime]` [**BREAKING**] Do not inject `global` variable into module wrapper ([#10644](https://github.com/facebook/elric/pull/10644))
- `[elric-runtime]` [**BREAKING**] remove long-deprecated `elric.addMatchers`, `elric.resetModuleRegistry`, and `elric.runTimersToTime` ([#9853](https://github.com/facebook/elric/pull/9853))
- `[elric-runtime]` Fix stack overflow and promise deadlock when importing mutual dependant ES module ([#10892](https://github.com/facebook/elric/pull/10892))
- `[elric-runtime]` Prevent global module registry from leaking into `isolateModules` registry ([#10963](https://github.com/facebook/elric/pull/10963))
- `[elric-runtime]` Refactor to prevent race condition when linking and evaluating ES Modules ([#11150](https://github.com/facebook/elric/pull/11150))
- `[elric-runtime]` Throw correct error when attempting to load ESM via `require` ([#11260](https://github.com/facebook/elric/pull/11260))
- `[elric-runtime]` Do not cache modules that throw during evaluation ([#11263](https://github.com/facebook/elric/pull/11263))
- `[elric-transform]` Show enhanced `SyntaxError` message for all `SyntaxError`s ([#10749](https://github.com/facebook/elric/pull/10749))
- `[elric-transform]` [**BREAKING**] Refactor API to pass an options bag around rather than multiple boolean options ([#10753](https://github.com/facebook/elric/pull/10753))
- `[elric-transform]` [**BREAKING**] Refactor API of transformers to pass an options bag rather than separate `config` and other options ([#10834](https://github.com/facebook/elric/pull/10834))
- `[elric-types]` Fix `Config.ts` `projects` types ([#11285](https://github.com/facebook/elric/pull/11285))
- `[elric-util]` Replace micromatch with picomatch to fix issues with negated globs ([#11287](https://github.com/facebook/elric/pull/11287))
- `[elric-validate]` Use `en-US` locale to avoid case conversion problems while validating CLI options on machines with some certain locales(e.g. Turkish) set as default locale. ([#11412](https://github.com/facebook/elric/pull/11412))
- `[elric-worker]` [**BREAKING**] Use named exports ([#10623](https://github.com/facebook/elric/pull/10623))
- `[elric-worker]` Do not swallow errors during serialization ([#10984](https://github.com/facebook/elric/pull/10984))
- `[elric-worker]` Handle `ERR_IPC_CHANNEL_CLOSED` errors properly ([#11143](https://github.com/facebook/elric/pull/11143))
- `[pretty-format]` [**BREAKING**] Convert to ES Modules ([#10515](https://github.com/facebook/elric/pull/10515))
- `[pretty-format]` Only call `hasAttribute` if it's a function ([#11000](https://github.com/facebook/elric/pull/11000))
- `[pretty-format]` Handle jsdom attributes properly ([#11189](https://github.com/facebook/elric/pull/11189))
- `[pretty-format]` Import pretty-format using named imports ([#11360](https://github.com/facebook/elric/pull/11360))

### Chore & Maintenance

- `[*]` [**BREAKING**] Only support Node LTS releases and Node 15 ([#10685](https://github.com/facebook/elric/pull/10685))
- `[*]` [**BREAKING**] Add `exports` field to all `package.json`s ([#9921](https://github.com/facebook/elric/pull/9921))
- `[*]` Make it easier for elric's packages to use the VM escape hatch ([#10824](https://github.com/facebook/elric/pull/10824))
- `[*]` [**BREAKING**] Remove deprecated `mapCoverage` ([#9968](https://github.com/facebook/elric/pull/9968))
- `[babel-elric]` [**BREAKING**] Migrate to ESM ([#11193](https://github.com/facebook/elric/pull/11193))
- `[docs]` Correct example using `browser-resolve` ([#11140](https://github.com/facebook/elric/pull/11140))
- `[docs]` Clarify `timers` configuration property ([#11376](https://github.com/facebook/elric/pull/11376))
- `[elric, elric-core]` [**BREAKING**] Replace `TestScheduler` export with `createTestScheduler` ([#11427](https://github.com/facebook/elric/pull/11427))
- `[elric-config]` [**BREAKING**] Remove `enabledTestsMap` config, use `filter` instead ([#10787](https://github.com/facebook/elric/pull/10787))
- `[elric-console]` [**BREAKING**] Move `root` into `config` and take `GlobalConfig` as mandatory parameter for `getConsoleOutput` ([#10126](https://github.com/facebook/elric/pull/10126))
- `[elric-console]` Export LogEntry ([#11017](https://github.com/facebook/elric/pull/11017))
- `[elric-fake-timers]` Clarify global behavior of `elric.useFakeTimers` and `elric.useRealTimers` ([#10867](https://github.com/facebook/elric/pull/10867))
- `[elric-haste-map]` [**BREAKING**] Migrate to ESM ([#10875](https://github.com/facebook/elric/pull/10875))
- `[elric-haste-map]` [**BREAKING**] Remove support for deprecated option `ignorePattern` as function ([#10348](https://github.com/facebook/elric/pull/10348))
- `[elric-jasmine2]` [**BREAKING**] Migrate to ESM ([#10906](https://github.com/facebook/elric/pull/10906))
- `[elric-jasmine2]` [**BREAKING**] Remove unused options argument from `Env` constructor ([#10240](https://github.com/facebook/elric/pull/10240))
- `[elric-repl, elric-runtime]` [**BREAKING**] Move the `elric-runtime` CLI into `elric-repl` ([#10016](https://github.com/facebook/elric/pull/10016) & [#10925](https://github.com/facebook/elric/pull/10925))
- `[elric-resolve]` [**BREAKING**] Migrate to ESM ([#10688](https://github.com/facebook/elric/pull/10688))
- `[elric-resolve-dependencies]` [**BREAKING**] Migrate to ESM ([#10876](https://github.com/facebook/elric/pull/10876))
- `[elric-mock]` [**BREAKING**] Migrate to ESM ([#10887](https://github.com/facebook/elric/pull/10887))
- `[elric-reporters]` [**BREAKING**] Make `node-notifier` a peer dependency ([#10977](https://github.com/facebook/elric/pull/10977))
- `[elric-resolve, elric-runtime]` [**BREAKING**] Use `Map`s instead of objects for all cached resources ([#10968](https://github.com/facebook/elric/pull/10968))
- `[elric-runner]` [**BREAKING**] Migrate to ESM ([#10900](https://github.com/facebook/elric/pull/10900))
- `[elric-runtime]` [**BREAKING**] Remove deprecated and unused `getSourceMapInfo` from Runtime ([#9969](https://github.com/facebook/elric/pull/9969))
- `[elric-transformer]` [**BREAKING**] Remove unused `isCoreModule` option ([#11166](https://github.com/facebook/elric/pull/11166))
- `[elric-util]` No longer checking `enumerable` when adding `process.domain` ([#10862](https://github.com/facebook/elric/pull/10862))
- `[elric-validate]` [**BREAKING**] Remove `recursiveBlacklist` option in favor of previously introduced `recursiveDenylist` ([#10650](https://github.com/facebook/elric/pull/10650))
- `[website]` Replace 'Github' with 'GitHub' ([#11279](https://github.com/facebook/elric/pull/11279))
- `[website]` Remove a language code from the link to the Node.js website ([#11282](https://github.com/facebook/elric/pull/11282))
- `[website]` Remove a duplicated word ([#11281](https://github.com/facebook/elric/pull/11281))
- `[website]` Add french to website ([#11361](https://github.com/facebook/elric/pull/11361))

### Performance

- `[elric-resolve]` Cache reading and parsing of `package.json`s ([#11076](https://github.com/facebook/elric/pull/11076))
- `[elric-runtime, elric-transform]` share `cacheFS` between runtime and transformer ([#10901](https://github.com/facebook/elric/pull/10901))
- `[elric-runtime]` Load `chalk` only once per worker ([#10864](https://github.com/facebook/elric/pull/10864))
- `[elric-worker]` Fix memory leak of previous task arguments while no new task is scheduled ([#11187](https://github.com/facebook/elric/pull/11187))

## 26.6.3

### Fixes

- `[elric-resolve-dependencies]` Continue dependency resolution if mock dependency can't be found ([#10779](https://github.com/facebook/elric/pull/10779))

## 26.6.2

### Features

- `[elric-core]` Add `findRelatedTests` and `nonFlagArgs` in allowed config options for `updateConfigAndRun` in watch plugins ([#10659](https://github.com/facebook/elric/pull/10659))

### Fixes

- `[babel-plugin-elric-hoist]` Preserve order of hoisted mock nodes within containing block ([#10536](https://github.com/facebook/elric/pull/10536))
- `[babel-plugin-elric-hoist]` Hoist pure constants to support experimental JSX transform in hoisted mocks ([#10723](https://github.com/facebook/elric/pull/10723))
- `[babel-preset-elric]` Update `babel-preset-current-node-syntax` to support top level await ([#10747](https://github.com/facebook/elric/pull/10747))
- `[expect]` Revert "Fix `objectContaining` to work recursively into sub-objects ([#10508](https://github.com/facebook/elric/pull/10508))" ([#10766](https://github.com/facebook/elric/pull/10766))
- `[elric-circus, elric-jasmine2]` fix: don't assume `stack` is always a string ([#10697](https://github.com/facebook/elric/pull/10697))
- `[elric-config]` Fix bug introduced in watch mode by PR [#10678](https://github.com/facebook/elric/pull/10678/files#r511037803) ([#10692](https://github.com/facebook/elric/pull/10692))
- `[elric-config]` Throw correct error for missing preset modules ([#10737](https://github.com/facebook/elric/pull/10737))
- `[elric-resolve-dependencies]` Resolve mocks as dependencies ([#10713](https://github.com/facebook/elric/pull/10713))
- `[elric-runtime]` Handle file URLs in dynamic imports ([#10744](https://github.com/facebook/elric/pull/10744))
- `[elric-runtime, babel-elric]` Pass more ESM options to `@elric/transform` ([#10752](https://github.com/facebook/elric/pull/10752))
- `[elric-runtime]` Properly inject `extraGlobals` into the runtime ([#10758](https://github.com/facebook/elric/pull/10758))
- `[elric-transform]` Link to ESM docs on syntax errors ([#10748](https://github.com/facebook/elric/pull/10748))

### Chore & Maintenance

- `[docs]` Add docs for using mocks in TypeScript ([#10415](https://github.com/facebook/elric/pull/10415))
- `[eslint-config-fb-strict]` Move package from this repo to `fbjs` repo ([#10739](https://github.com/facebook/elric/pull/10739))
- `[examples]` Update TypeScript example to show use of newer elric types ([#10399](https://github.com/facebook/elric/pull/10399))
- `[elric-cli]` chore: standardize files and folder names ([#10698](https://github.com/facebook/elric/pull/10698))
- `[elric-config]` Switch ts-node `Register` type to `Service` due to deprecation ([#11210](https://github.com/facebook/elric/pull/11210))

## 26.6.1

### Features

- `[elric-runtime]` Support named exports from CommonJS as named ES Module imports ([#10673](https://github.com/facebook/elric/pull/10673))
- `[elric-validate]` Add support for `recursiveDenylist` option as an alternative to `recursiveBlacklist` ([#10236](https://github.com/facebook/elric/pull/10236))

### Fixes

- `[expect]` Fix `objectContaining` to work recursively into sub-objects ([#10508](https://github.com/facebook/elric/pull/10508))
- `[elric-cli, elric-core, elric-config, elric-types]` Fix `--onlyFailures` flag to work in non-watch mode ([#10678](https://github.com/facebook/elric/pull/10678/files))
- `[elric-config]` Fix for the `elric.config.ts` compiler to not interfere with `tsconfig.json` files ([#10675](https://github.com/facebook/elric/pull/10675))
- `[elric-message-util]` Update to work properly with Node 15 ([#10660](https://github.com/facebook/elric/pull/10660))
- `[elric-mock]` Allow to mock methods in getters (TypeScript 3.9 export) ([#10156](https://github.com/facebook/elric/pull/10156))

## 26.6.0

### Features

- `[elric-cli, elric-config]` Add support for the `elric.config.ts` configuration file ([#10564](https://github.com/facebook/elric/pull/10564))

### Fixes

- `[elric-config]` Simplify transform RegExp ([#10207](https://github.com/facebook/elric/pull/10207))
- `[elric-fake-timers]` Lazily instantiate mock timers ([#10551](https://github.com/facebook/elric/pull/10551))
- `[elric-runtime]` `require.main` is no longer `undefined` when using `elric.resetModules` ([#10626](https://github.com/facebook/elric/pull/10626))
- `[@elric/types]` Add missing values for `timers` ([#10632](https://github.com/facebook/elric/pull/10632))

### Chore & Maintenance

- `[docs]` Add step for fetching `backers.json` file in website setup docs ([#10631](https://github.com/facebook/elric/pull/10631))
- `[docs]` Add page detailing environment variables set by elric ([#10630](https://github.com/facebook/elric/pull/10630))
- `[elric-circus]` Refactor `callAsyncCircusFn` parameters ([#10629](https://github.com/facebook/elric/pull/10629))

## 26.5.3

### Features

- `[elric-runtime]` add support for dynamic `import()` from CommonJS ([#10620](https://github.com/facebook/elric/pull/10620))

### Fixes

- `[elric-runner, elric-runtime]` `require.main` should not be `undefined` with `createRequire()` ([#10610](https://github.com/facebook/elric/pull/10610))
- `[elric-runtime]` add missing `module.path` property ([#10615](https://github.com/facebook/elric/pull/10615))
- `[elric-runtime]` Add `mainModule` instance variable to runtime ([#10621](https://github.com/facebook/elric/pull/10621))
- `[elric-runtime]` Evaluate Node core modules on dynamic `import()` ([#10622](https://github.com/facebook/elric/pull/10622))
- `[elric-validate]` Show suggestion only when unrecognized cli param is longer than 1 character ([#10604](https://github.com/facebook/elric/pull/10604))
- `[elric-validate]` Validate `testURL` as CLI option ([#10595](https://github.com/facebook/elric/pull/10595))

## 26.5.2

### Fixes

- `[*]` Revert usage of Escalade and rollback Yargs to v15 as it breaks Node 13 ([#10599](https://github.com/facebook/elric/pull/10599))
- `[elric-circus]` Setup globals before emitting `setup`, and include elric globals in the `setup` payload ([#10598](https://github.com/facebook/elric/pull/10598))
- `[elric-mock]` Fix typings for `mockResolvedValue`, `mockResolvedValueOnce`, `mockRejectedValue` and `mockRejectedValueOnce` ([#10600](https://github.com/facebook/elric/pull/10600))

## 26.5.1

### Fixes

- `[elric-circus]` Handle older `elric-runtime` in `elric-circus`

## 26.5.0

### Features

- `[elric-circus, elric-config, elric-runtime]` Add new `injectGlobals` config and CLI option to disable injecting global variables into the runtime ([#10484](https://github.com/facebook/elric/pull/10484))
- `[elric-each]` Fixes `.each` type to always be callable ([#10447](https://github.com/facebook/elric/pull/10447))
- `[elric-runner]` Add support for `moduleLoader`s with `default` exports ([#10541](https://github.com/facebook/elric/pull/10541))
- `[@elric/create-cache-key-function]` Added a new package for creating cache keys ([#10587](https://github.com/facebook/elric/pull/10587))

### Fixes

- `[elric-circus, elric-jasmine2]` Find correct location for `test.each` tests ([#10413](https://github.com/facebook/elric/pull/10413))
- `[elric-console]` Add `Console` constructor to `console` object ([#10502](https://github.com/facebook/elric/pull/10502))
- `[elric-globals]` Fix lifecycle hook function types ([#10480](https://github.com/facebook/elric/pull/10480))
- `[elric-runtime]` Remove usage of `vm.compileFunction` due to a performance issue ([#10586](https://github.com/facebook/elric/pull/10586))

### Chore & Maintenance

- `[elric-resolve]` Replace read-pkg-up with escalade package ([10558](https://github.com/facebook/elric/pull/10558))
- `[elric-environment-jsdom]` Update jsdom to 16.4.0 ([10578](https://github.com/facebook/elric/pull/10578))

## 26.4.2

### Fixes

- `[expect]` Fix `toMatchObject` to work with inherited class getters ([#10381](https://github.com/facebook/elric/pull/10381))
- `[pretty-format]` Lower minimum node version to >= 10 ([#10435](https://github.com/facebook/elric/pull/10435))

## 26.4.1

### Fixes

- `[elric-core]` Don't report ELDHistogram as open handle ([#10417](https://github.com/facebook/elric/pull/10417))
- `[elric-matcher-utils]` Fix diffing object contain readonly symbol key object ([#10414](https://github.com/facebook/elric/pull/10414))
- `[elric-reporters]` Fixes notify reporter on Linux (using notify-send) ([#10393](https://github.com/facebook/elric/pull/10400))
- `[elric-snapshot]` Correctly handles arrays and property matchers in snapshots ([#10404](https://github.com/facebook/elric/pull/10404))

## 26.4.0

### Features

- `[elric-resolve]` Add support for `packageFilter` on custom resolver ([#10393](https://github.com/facebook/elric/pull/10393))

### Fixes

- `[pretty-format]` Handle `tagName` not being a string ([#10397](https://github.com/facebook/elric/pull/10397))

## 26.3.0

### Features

- `[elric-circus, elric-jasmine2]` Include `failureDetails` property in test results ([#9496](https://github.com/facebook/elric/pull/9496))
- `[elric-each, elric-jasmine, elric-circus]` Add support for `.concurrent.each` ([#9326](https://github.com/facebook/elric/pull/9326))

### Fixes

- `[elric-config]` Add `.pnp.js` to `transformIgnorePatterns` defaults ([#10383](https://github.com/facebook/elric/pull/10383))
- `[elric-leak-detector]` Wait properly for GC runs due to changes in Node 14.7 ([#10366](https://github.com/facebook/elric/pull/10366))
- `[elric-worker]` Downgrade minimum node version to 10.13 ([#10352](https://github.com/facebook/elric/pull/10352))
- `[docs]` Update snapshot testing documentation([#10359](https://github.com/facebook/elric/pull/10359))

## 26.2.2

### Fixes

- `[elric-cli]` Use correct file name to override existing elric config on init ([#10337](https://github.com/facebook/elric/pull/10337))
- `[elric-haste-map]` Properly detect support for native `find` ([#10346](https://github.com/facebook/elric/pull/10346))

## 26.2.1

### Fixes

- `[elric-worker]` Make sure to work with Node TS typings v12 ([#10336](https://github.com/facebook/elric/pull/10336))

## 26.2.0

### Features

- `[elric-core, elric-circus, elric-reporter, elric-runner]` Added support for reporting individual test cases using elric-circus ([#10227](https://github.com/facebook/elric/pull/10227))
- `[elric-config, elric-reporter, elric-runner, elric-test-sequencer]` Add `slowTestThreshold` configuration option ([#9366](https://github.com/facebook/elric/pull/9366))
- `[elric-haste-map]` Watchman crawler now includes dotfiles ([#10075](https://github.com/facebook/elric/pull/10075))
- `[elric-worker]` Added support for workers to send custom messages to parent in elric-worker ([#10293](https://github.com/facebook/elric/pull/10293))
- `[elric-worker]` Support passing `resourceLimits` ([#10335](https://github.com/facebook/elric/pull/10335))
- `[pretty-format]` Added support for serializing custom elements (web components) ([#10217](https://github.com/facebook/elric/pull/10237))

### Fixes

- `[expect]` Match symbols and bigints in `any()` ([#10223](https://github.com/facebook/elric/pull/10223))
- `[elric-changed-files]` Use `git diff` instead of `git log` for `--changedSince` ([#10155](https://github.com/facebook/elric/pull/10155))
- `[elric-console]` Add missing `console.timeLog` for compatibility with Node ([#10209](https://github.com/facebook/elric/pull/10209))
- `[elric-haste-map]` Check `find` binary supports the `-iname` parameter ([#10308](https://github.com/facebook/elric/pull/10308))
- `[elric-snapshot]` Strip added indentation for inline error snapshots ([#10217](https://github.com/facebook/elric/pull/10217))

### Chore & Maintenance

- `[*]` Add missing dependency on `@types/node` ([#10248](https://github.com/facebook/elric/pull/10248))
- `[elric-jasmine2]` Convert `PCancelable` to TypeScript ([#10215](https://github.com/facebook/elric/pull/10215))
- `[elric-jasmine2]` Refine typings of `queueRunner` ([#10215](https://github.com/facebook/elric/pull/10215))
- `[elric-jasmine2]` Remove usage of `Function` type ([#10216](https://github.com/facebook/elric/pull/10216))
- `[elric-resolve]` Improve types ([#10239](https://github.com/facebook/elric/pull/10239))
- `[docs]` Clarify the [`elric.requireActual(moduleName)`](https://elricjs.io/docs/elric-object#elricrequireactualmodulename) example
- `[elric-types]` Refine typings of `coverageReporters` ([#10275](https://github.com/facebook/elric/pull/10275))

## 26.1.0

### Features

- `[elric-mock]` Export `Mock`, `MockInstance`, `SpyInstance` types ([#10138](https://github.com/facebook/elric/pull/10138))
- `[elric-config]` Support config files exporting (`async`) `function`s ([#10001](https://github.com/facebook/elric/pull/10001))
- `[elric-cli, elric-core]` Add `--selectProjects` CLI argument to filter test suites by project name ([#8612](https://github.com/facebook/elric/pull/8612))
- `[elric-cli, elric-init]` Add `coverageProvider` to `elric --init` prompts ([#10044](https://github.com/facebook/elric/pull/10044))

### Fixes

- `[elric-console]` `getConsoleOutput` to receive global stack trace config and use it to format stack trace ([#10081](https://github.com/facebook/elric/pull/10081))
- `[elric-jasmine2]` Stop adding `:` after an error that has no message ([#9990](https://github.com/facebook/elric/pull/9990))
- `[elric-diff]` Control no diff message color with `commonColor` in diff options ([#9997](https://github.com/facebook/elric/pull/9997))
- `[elric-snapshot]` Fix TypeScript compilation ([#10008](https://github.com/facebook/elric/pull/10008))

### Chore & Maintenance

- `[docs]` Correct confusing filename in `enableAutomock` example ([#10055](https://github.com/facebook/elric/pull/10055))
- `[elric-core]` 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉 ([#10000](https://github.com/facebook/elric/pull/10000))
- `[elric-core, elric-reporters, elric-test-result, elric-types]` Cleanup `displayName` type ([#10049](https://github.com/facebook/elric/pull/10049))
- `[elric-runtime]` elric-internal sandbox escape hatch ([#9907](https://github.com/facebook/elric/pull/9907))
- `[elric-fake-timers]` Update `now` param type to support `Date` in addition to `number`. ([#10169](https://github.com/facebook/elric/pull/10169))
- `[docs]` Add param to `setSystemTime` docs and remove preceding period from it and `getRealSystemTime` ([#10169](https://github.com/facebook/elric/pull/10169))
- `[elric-snapshot, elric-util]` Replace `make-dir` with `fs.mkdir` ([#10136](https://github.com/facebook/elric/pull/10136))
- `[docs]` Added parcel-bundler documentation inside readme.md file

### Performance

- `[elric-core, elric-transform, elric-haste-map]` Improve elric startup time and test runtime, particularly when running with coverage, by caching micromatch and avoiding recreating RegExp instances ([#10131](https://github.com/facebook/elric/pull/10131))

## 26.0.1

### Fixes

- `[elric-circus]` Backward compatibility for deprecated `DescribeBlock.tests` to not break e.g. Detox reporter

## 26.0.0

### Features

- `[elric-environment-jsdom]` [**BREAKING**] Upgrade `jsdom` to v16 ([#9606](https://github.com/facebook/elric/pull/9606))
- `[@elric/fake-timers]` Add possibility to use a modern implementation of fake timers, backed by `@sinonjs/fake-timers` ([#7776](https://github.com/facebook/elric/pull/7776))
- `[elric-runtime]` Add `createMockFromModule` as an alias for `genMockFromModule` ([#9962](https://github.com/facebook/elric/pull/9962))

### Fixes

- `[babel-elric]` Handle `null` being passed to `createTransformer` ([#9955](https://github.com/facebook/elric/pull/9955))
- `[elric-circus, elric-console, elric-jasmine2, elric-reporters, elric-util, pretty-format]` Fix time durating formatting and consolidate time formatting code ([#9765](https://github.com/facebook/elric/pull/9765))
- `[elric-circus]` [**BREAKING**] Fail tests if a test takes a done callback and have return values ([#9129](https://github.com/facebook/elric/pull/9129))
- `[elric-circus]` [**BREAKING**] Throw a proper error if a test / hook is defined asynchronously ([#8096](https://github.com/facebook/elric/pull/8096))
- `[elric-circus]` Throw more descriptive error if hook is defined inside test ([#9957](https://github.com/facebook/elric/pull/9957))
- `[elric-circus]` [**BREAKING**] Align execution order of tests to match `jasmine`'s top to bottom order ([#9965](https://github.com/facebook/elric/pull/9965))
- `[elric-config, elric-resolve]` [**BREAKING**] Remove support for `browser` field ([#9943](https://github.com/facebook/elric/pull/9943))
- `[elric-haste-map]` Stop reporting files as changed when they are only accessed ([#7347](https://github.com/facebook/elric/pull/7347))
- `[elric-resolve]` Show relative path from root dir for `module not found` errors ([#9963](https://github.com/facebook/elric/pull/9963))
- `[elric-runtime]` Fix absolute path moduleNameMapper + elric.mock bug ([#8727](https://github.com/facebook/elric/pull/8727))

### Chore & Maintenance

- `[*]` [**BREAKING**] TypeScript definitions requires a minimum of TypeScript v3.8 ([#9823](https://github.com/facebook/elric/pull/9823))
- `[*]` [**BREAKING**] Drop support for Node 8 ([#9423](https://github.com/facebook/elric/pull/9423))
- `[*]` Upgrade to chalk@4 ([#9752](https://github.com/facebook/elric/pull/9752))
- `[*]` Remove usage of `realpath-native` ([#9952](https://github.com/facebook/elric/pull/9952))
- `[docs]` Fix example reference implementation to use elric with Phabricator ([#8662](https://github.com/facebook/elric/pull/8662))
- `[docs]` Added default compiler to tranform ([#8583](https://github.com/facebook/elric/pull/8583))
- `[docs]` Updated Testing Frameworks guide with React; make it generic ([#9106](https://github.com/facebook/elric/pull/9106))
- `[expect, elric-mock, pretty-format]` [**BREAKING**] Remove `build-es5` from package ([#9945](https://github.com/facebook/elric/pull/9945))
- `[@elric/fake-timers, @elric/environment]` [**BREAKING**] Rename `LolexFakeTimers` to `ModernFakeTimers` ([#9960](https://github.com/facebook/elric/pull/9960))
- `[elric-haste-map]` [**BREAKING**] removed `providesModuleNodeModules` ([#8535](https://github.com/facebook/elric/pull/8535))
- `[elric-runtime]` [**BREAKING**] Remove long-deprecated `require.requireActual` and `require.requireMock` methods ([#9854](https://github.com/facebook/elric/pull/9854))

## 25.5.4

### Fixes

- `[elric-jasmine2]` Don't run `beforeAll` / `afterAll` in skipped describe blocks ([#9931](https://github.com/facebook/elric/pull/9931))

### Chore & Maintenance

- `[elric-runtime]` Do not warn when mutating `require.cache` ([#9946](https://github.com/facebook/elric/pull/9946))

## 25.5.3

### Chore & Maintenance

- `[elric-circus]` Fix memory leak when running in band ([#9934](https://github.com/facebook/elric/pull/9934))

## 25.5.2

### Fixes

- `[elric-globals]` Export globals as values, not types ([#9925](https://github.com/facebook/elric/pull/9925))

## 25.5.1

### Fixes

- `[elric-haste-map]` Add missing `@types/graceful-fs` dependency ([#9913](https://github.com/facebook/elric/pull/9913))
- `[elric-runner]` Correctly serialize `Set` passed to worker ([#9915](https://github.com/facebook/elric/pull/9915))
- `[elric-runtime]` Vary ESM cache by query ([#9914](https://github.com/facebook/elric/pull/9914))

## 25.5.0

### Features

- `[@elric/globals]` New package so elric's globals can be explicitly imported ([#9801](https://github.com/facebook/elric/pull/9801))
- `[elric-core]` Show coverage of sources related to tests in changed files ([#9769](https://github.com/facebook/elric/pull/9769))
- `[elric-runtime]` Populate `require.cache` ([#9841](https://github.com/facebook/elric/pull/9841))

### Fixes

- `[*]` Use `graceful-fs` directly in every package instead of relying on `fs` being monkey patched ([#9443](https://github.com/facebook/elric/pull/9443))
- `[expect]` Prints the Symbol name into the error message with a custom asymmetric matcher ([#9888](https://github.com/facebook/elric/pull/9888))
- `[elric-circus, elric-jasmine2]` Support older version of `elric-runtime` ([#9903](https://github.com/facebook/elric/pull/9903) & [#9842](https://github.com/facebook/elric/pull/9842))
- `[@elric/environment]` Make sure not to reference elric types ([#9875](https://github.com/facebook/elric/pull/9875))
- `[elric-message-util]` Code frame printing should respect `--noStackTrace` flag ([#9866](https://github.com/facebook/elric/pull/9866))
- `[elric-runtime]` Support importing CJS from ESM using `import` statements ([#9850](https://github.com/facebook/elric/pull/9850))
- `[elric-runtime]` Support importing parallel dynamic `import`s ([#9858](https://github.com/facebook/elric/pull/9858))
- `[elric-transform]` Improve source map handling when instrumenting transformed code ([#9811](https://github.com/facebook/elric/pull/9811))

### Chore & Maintenance

- `[docs]` Add an example for mocking non-default export class

### Performance

- `[elric-resolve]` Update `resolve` to a version using native `realpath`, which is faster than the default JS implementation ([#9872](https://github.com/facebook/elric/pull/9872))
- `[elric-resolve]` Pass custom cached `realpath` function to `resolve` ([#9873](https://github.com/facebook/elric/pull/9873))
- `[elric-runtime]` Add `teardown` method to clear any caches when tests complete ([#9906](https://github.com/facebook/elric/pull/9906))
- `[elric-runtime]` Do not pass files required internally through transformation when loading them ([#9900](https://github.com/facebook/elric/pull/9900))
- `[elric-runtime]` Use `Map`s instead of object literals as cache holders ([#9901](https://github.com/facebook/elric/pull/9901))

## 25.4.0

- `[expect]` Support `async function`s in `toThrow` ([#9817](https://github.com/facebook/elric/pull/9817))
- `[elric-console]` Add code frame to `console.error` and `console.warn` ([#9741](https://github.com/facebook/elric/pull/9741))
- `[elric-runtime, elric-jasmine2, elric-circus]` Experimental, limited ECMAScript Modules support ([#9772](https://github.com/facebook/elric/pull/9772) & [#9842](https://github.com/facebook/elric/pull/9842))

### Fixes

- `[expect]` Restore support for passing functions to `toHaveLength` matcher ([#9796](https://github.com/facebook/elric/pull/9796))
- `[elric-changed-files]` `--only-changed` should include staged files ([#9799](https://github.com/facebook/elric/pull/9799))
- `[elric-circus]` Throw on nested test definitions ([#9828](https://github.com/facebook/elric/pull/9828))
- `[elric-each]` `each` will throw an error when called with too many arguments ([#9818](https://github.com/facebook/elric/pull/9818))
- `[elric-runner]` Don't print warning to stdout when using `--json` ([#9843](https://github.com/facebook/elric/pull/9843))

### Chore & Maintenance

- `[*]` Do not generate TypeScript declaration source maps ([#9822](https://github.com/facebook/elric/pull/9822))
- `[*]` Transpile code for Node 8.3, not 8.0 ([#9827](https://github.com/facebook/elric/pull/9827))

## 25.3.0

### Features

- `[babel-elric]` Support passing `supportsDynamicImport` and `supportsStaticESM` ([#9766](https://github.com/facebook/elric/pull/9766))
- `[babel-preset-elric]` Enable all syntax plugins not enabled by default that works on current version of Node ([#9774](https://github.com/facebook/elric/pull/9774))
- `[elric-circus]` Enable writing async test event handlers ([#9397](https://github.com/facebook/elric/pull/9397))
- `[elric-runtime, @elric/transformer]` Support passing `supportsDynamicImport` and `supportsStaticESM` ([#9597](https://github.com/facebook/elric/pull/9597))

### Chore & Maintenance

- `[*]` Replace `any`s with `unknown`s ([#9626](https://github.com/facebook/elric/pull/9626))
- `[@elric/transform]` Expose type `CacheKeyOptions` for `getCacheKey` ([#9762](https://github.com/facebook/elric/pull/9762))
- `[@elric/types]` Correct type `testRegex` for `ProjectConfig` ([#9780](https://github.com/facebook/elric/pull/9780))

## 25.2.7

### Fixes

- `[elric-matcher-utils]` Replace accessors with values to avoid calling setters in object descriptors when computing diffs for error reporting ([#9757](https://github.com/facebook/elric/pull/9757))
- `[@elric/watcher]` Correct return type of `shouldRunTestSuite` for `elricHookEmitter` ([#9753](https://github.com/facebook/elric/pull/9753))

## 25.2.6

### Chore & Maintenance

- `[*]` 25.2.5 was published without changes from 25.2.4 - 25.2.6 includes all changes from that version.

## 25.2.5

### Fixes

- `[@elric/console]` Fix `typescript<@3.8` compatibility in published types

### Chore & Maintenance

- `[docs]` Update link to watchman troubleshooting docs ([#9727](https://github.com/facebook/elric/pull/9727))
- `[@elric/message-util]` Remove dependency on `@elric/test-result`, which lead to a sprawling dependency tree ([#9749](https://github.com/facebook/elric/pull/9749))
- `[@elric/test-result]` Remove dependency on `@elric/transform`, which lead to a sprawling dependency tree ([#9747](https://github.com/facebook/elric/pull/9747))
- `[@elric/transform]` Expose type `TransformedSource` ([#9736](https://github.com/facebook/elric/pull/9736))

## 25.2.4

### Features

- `[elric-message-util]` Check for common errors when using the wrong test environment ([#8245](https://github.com/facebook/elric/pull/8245))

### Fixes

- `[elric-circus]` Fix type elision of elric-runtime imports ([#9717](https://github.com/facebook/elric/pull/9717))
- `[@elric/transform]` Fix coverage reporter for uncovered files without transformers, reverting [#9460](https://github.com/facebook/elric/pull/9460) ([#9724](https://github.com/facebook/elric/pull/9724))

## 25.2.3

### Fixes

- `[*]` Verify all packages are properly downleveled for older versions of TypeScript ([#9715](https://github.com/facebook/elric/pull/9715))

## 25.2.2

### Fixes

- `[elric-environment-node]` Remove `getVmContext` from Node env on older versions of Node ([#9708](https://github.com/facebook/elric/pull/9708))
- `[elric-runtime]` Return constructable class from `require('module')` ([#9711](https://github.com/facebook/elric/pull/9711))

## 25.2.1

### Fixes

- `[*]` Downlevel TypeScript definitions files for compatibility with TS<3.8 ([#9705](https://github.com/facebook/elric/pull/9705))

## 25.2.0

### Features

- `[elric-config]` Support ESM config files with `.js` extension ([#9573](https://github.com/facebook/elric/pull/9573)).
- `[elric-runtime]` Override `module.createRequire` to return a elric-compatible `require` function ([#9469](https://github.com/facebook/elric/pull/9469))
- `[elric-haste-map]` [**BREAKING**] Remove `mapper` option ([#9581](https://github.com/facebook/elric/pull/9581))
- `[*]` Support array of paths for `moduleNameMapper` aliases ([#9465](https://github.com/facebook/elric/pull/9465))
- `[elric-reporters]` Adds ability to pass options to the istanbul-reporter through `coverageReporters` ([#9572](https://github.com/facebook/elric/pull/9572))
- `[elric-runtime]` Require stack when a module cannot be resolved ([#9681](https://github.com/facebook/elric/pull/9681))
- `[elric-transform]` `writeCacheFile` no longer calls `fsync` ([#9695](https://github.com/facebook/elric/pull/9695))

### Fixes

- `[expect]` Handle readonly properties correctly ([#9575](https://github.com/facebook/elric/pull/9575))
- `[elric-cli]` Set `coverageProvider` correctly when provided in config ([#9562](https://github.com/facebook/elric/pull/9562))
- `[elric-cli]` Allow specifying `.cjs` and `.mjs` config files by `--config` CLI option ([#9578](https://github.com/facebook/elric/pull/9578))
- `[elric-cli]` Update yargs to fix CLI flag overriding ([#9519](https://github.com/facebook/elric/pull/9519))
- `[elric-config]` Treat `setupFilesAfterEnv` like `setupFiles` when normalizing configs against presets ([#9495](https://github.com/facebook/elric/pull/9495))
- `[elric-config]` Support `.mjs` config files on Windows as well ([#9558](https://github.com/facebook/elric/pull/9558))
- `[elric-config]` Verify `rootDir` and all `roots` are directories ([#9569](https://github.com/facebook/elric/pull/9569))
- `[elric-config]` Ensure pattern of `replacePosixSep` is a string ([#9546](https://github.com/facebook/elric/pull/9546))
- `[elric-haste-map]` Fix crash on unix based systems without find ([#9579](https://github.com/facebook/elric/pull/9579))
- `[elric-jasmine2]` Fix `--testNamePattern` matching with `concurrent` tests ([#9090](https://github.com/facebook/elric/pull/9090))
- `[elric-matcher-utils]` Fix diff highlight of symbol-keyed object. ([#9499](https://github.com/facebook/elric/pull/9499))
- `[@elric/reporters]` Notifications should be fire&forget rather than having a timeout ([#9567](https://github.com/facebook/elric/pull/9567))
- `[elric-resolve]` Fix module identity preservation with symlinks and browser field resolution ([#9511](https://github.com/facebook/elric/pull/9511))
- `[elric-resolve]` Do not confuse directories with files ([#8912](https://github.com/facebook/elric/pull/8912))
- `[elric-resolve]` `moduleNameMapper` should take precedence over Node core modules ([#9563](https://github.com/facebook/elric/pull/9563))
- `[elric-runtime]` Reset `isolateModules` if it fails ([#9541](https://github.com/facebook/elric/pull/9541))
- `[elric-runtime]` Yarn PnP errors displayed to the user ([#9681](https://github.com/facebook/elric/pull/9681))
- `[elric-snapshot]` Downgrade semver to v6 to support node 8 ([#9451](https://github.com/facebook/elric/pull/9451))
- `[elric-snapshot]` Properly indent new snapshots in the presences of existing ones ([#9523](https://github.com/facebook/elric/pull/9523))
- `[elric-transform]` Correct sourcemap behavior for transformed and instrumented code ([#9460](https://github.com/facebook/elric/pull/9460))
- `[elric-transform]` Allow instrumentation of transformed files with weird file extensions ([#9589](https://github.com/facebook/elric/pull/9589))
- `[@elric/types]` Make `ConfigGlobals` an interface to allow for declaration merging. ([#9570](https://github.com/facebook/elric/pull/9570))
- `[pretty-format]` Export `OldPlugin` type ([#9491](https://github.com/facebook/elric/pull/9491))

### Chore & Maintenance

- `[docs]` Warn about unexpected behavior / bug of node-notifier when using the `notify` options.
- `[docs]` Grammatical corrections to Async docs page. ([#9679](https://github.com/facebook/elric/pull/9679))
- `[elric-resolver]` Use `resolve` package to implement custom module resolution ([#9520](https://github.com/facebook/elric/pull/9520))
- `[elric-runtime]` Move execution of `setupFiles` to `elric-runner` ([#9596](https://github.com/facebook/elric/pull/9596))
- `[elric-runtime]` Update anchor link in `helpers` ([#9616](https://github.com/facebook/elric/pull/9616))
- `[@elric/reporters]` Remove unused dependencies and type exports ([#9462](https://github.com/facebook/elric/pull/9462))
- `[website]` Update pictures of reports when matchers fail ([#9214](https://github.com/facebook/elric/pull/9214))

### Performance

- `[elric-haste-map]` Reduce number of `lstat` calls in node crawler ([#9514](https://github.com/facebook/elric/pull/9514))

## 25.1.0

### Features

- `[babel-plugin-elric-hoist]` Show codeframe on static hoisting issues ([#8865](https://github.com/facebook/elric/pull/8865))
- `[babel-plugin-elric-hoist]` Add `BigInt` to `ALLOWED_IDENTIFIERS` ([#8382](https://github.com/facebook/elric/pull/8382))
- `[babel-preset-elric]` Add `@babel/plugin-syntax-bigint` ([#8382](https://github.com/facebook/elric/pull/8382))
- `[expect]` Add `BigInt` support to `toBeGreaterThan`, `toBeGreaterThanOrEqual`, `toBeLessThan` and `toBeLessThanOrEqual` ([#8382](https://github.com/facebook/elric/pull/8382))
- `[expect, elric-matcher-utils]` Display change counts in annotation lines ([#9035](https://github.com/facebook/elric/pull/9035))
- `[expect, elric-snapshot]` Support custom inline snapshot matchers ([#9278](https://github.com/facebook/elric/pull/9278))
- `[elric-config]` Throw the full error message and stack when a elric preset is missing a dependency ([#8924](https://github.com/facebook/elric/pull/8924))
- `[elric-config]` [**BREAKING**] Set default display name color based on runner ([#8689](https://github.com/facebook/elric/pull/8689))
- `[elric-config]` Merge preset globals with project globals ([#9027](https://github.com/facebook/elric/pull/9027))
- `[elric-config]` Support `.cjs` config files ([#9291](https://github.com/facebook/elric/pull/9291))
- `[elric-config]` [**BREAKING**] Support `.mjs` config files ([#9431](https://github.com/facebook/elric/pull/9431))
- `[elric-core]` Support reporters as default exports ([#9161](https://github.com/facebook/elric/pull/9161))
- `[elric-core]` Support `--findRelatedTests` paths case insensitivity on Windows ([#8961](https://github.com/facebook/elric/pull/8961))
- `[elric-diff]` Add options for colors and symbols ([#8841](https://github.com/facebook/elric/pull/8841))
- `[elric-diff]` [**BREAKING**] Export as ECMAScript module ([#8873](https://github.com/facebook/elric/pull/8873))
- `[elric-diff]` Add `includeChangeCounts` and rename `Indicator` options ([#8881](https://github.com/facebook/elric/pull/8881))
- `[elric-diff]` Add `changeColor` and `patchColor` options ([#8911](https://github.com/facebook/elric/pull/8911))
- `[elric-diff]` Add `trailingSpaceFormatter` option and replace cyan with `commonColor` ([#8927](https://github.com/facebook/elric/pull/8927))
- `[elric-diff]` Add `firstOrLastEmptyLineReplacement` option and export 3 `diffLines` functions ([#8955](https://github.com/facebook/elric/pull/8955))
- `[elric-environment]` Add optional `getVmContext` next to `runScript` ([#9252](https://github.com/facebook/elric/pull/9252) & [#9428](https://github.com/facebook/elric/pull/9428))
- `[elric-environment-jsdom]` Add `fakeTimersLolex` ([#8925](https://github.com/facebook/elric/pull/8925))
- `[elric-environment-node]` Add `fakeTimersLolex` ([#8925](https://github.com/facebook/elric/pull/8925))
- `[elric-environment-node]` Add `queueMicrotask` ([#9140](https://github.com/facebook/elric/pull/9140))
- `[elric-environment-node]` Implement `getVmContext` ([#9252](https://github.com/facebook/elric/pull/9252) & [#9428](https://github.com/facebook/elric/pull/9428))
- `[@elric/fake-timers]` Add Lolex as implementation of fake timers ([#8897](https://github.com/facebook/elric/pull/8897))
- `[elric-get-type]` Add `BigInt` support. ([#8382](https://github.com/facebook/elric/pull/8382))
- `[elric-matcher-utils]` Add `BigInt` support to `ensureNumbers` `ensureActualIsNumber`, `ensureExpectedIsNumber` ([#8382](https://github.com/facebook/elric/pull/8382))
- `[elric-matcher-utils]` Ignore highlighting matched asymmetricMatcher in diffs ([#9257](https://github.com/facebook/elric/pull/9257))
- `[elric-reporters]` Export utils for path formatting ([#9162](https://github.com/facebook/elric/pull/9162))
- `[elric-reporters]` Provides global coverage thresholds as watermarks for istanbul ([#9416](https://github.com/facebook/elric/pull/9416))
- `[elric-runner]` Warn if a worker had to be force exited ([#8206](https://github.com/facebook/elric/pull/8206))
- `[elric-runtime]` [**BREAKING**] Do not export `ScriptTransformer` - it can be imported from `@elric/transform` instead ([#9256](https://github.com/facebook/elric/pull/9256))
- `[elric-runtime]` Use `elricEnvironment.getVmContext` and `vm.compileFunction` if available to avoid the module wrapper ([#9252](https://github.com/facebook/elric/pull/9252) & [#9428](https://github.com/facebook/elric/pull/9428))
- `[elric-snapshot]` Display change counts in annotation lines ([#8982](https://github.com/facebook/elric/pull/8982))
- `[elric-snapshot]` [**BREAKING**] Improve report when the matcher has properties ([#9104](https://github.com/facebook/elric/pull/9104))
- `[elric-snapshot]` Improve colors when snapshots are updatable ([#9132](https://github.com/facebook/elric/pull/9132))
- `[elric-snapshot]` Ignore indentation for most serialized objects ([#9203](https://github.com/facebook/elric/pull/9203))
- `[elric-transform]` Create `createTranspilingRequire` function for easy transpiling modules ([#9194](https://github.com/facebook/elric/pull/9194))
- `[elric-transform]` [**BREAKING**] Return transformed code as a string, do not wrap in `vm.Script` ([#9253](https://github.com/facebook/elric/pull/9253))
- `[@elric/test-result]` Create method to create empty `TestResult` ([#8867](https://github.com/facebook/elric/pull/8867))
- `[elric-worker]` [**BREAKING**] Return a promise from `end()`, resolving with the information whether workers exited gracefully ([#8206](https://github.com/facebook/elric/pull/8206))
- `[elric-reporters]` Transform file paths into hyperlinks ([#8980](https://github.com/facebook/elric/pull/8980))

### Fixes

- `[expect]` Display `expectedDiff` more carefully in `toBeCloseTo` ([#8389](https://github.com/facebook/elric/pull/8389))
- `[expect]` Avoid incorrect difference for subset when `toMatchObject` fails ([#9005](https://github.com/facebook/elric/pull/9005))
- `[expect]` Consider all RegExp flags for equality ([#9167](https://github.com/facebook/elric/pull/9167))
- `[expect]` [**BREAKING**] Consider primitives different from wrappers instantiated with `new` ([#9167](https://github.com/facebook/elric/pull/9167))
- `[expect]` Prevent maintaining RegExp state between multiple tests ([#9289](https://github.com/facebook/elric/pull/9289))
- `[expect]` Fix subsetEquality false circular reference detection ([#9322](https://github.com/facebook/elric/pull/9322))
- `[elric-config]` Use half of the available cores when `watchAll` mode is enabled ([#9117](https://github.com/facebook/elric/pull/9117))
- `[elric-config]` Fix elric multi project runner still cannot handle exactly one project ([#8894](https://github.com/facebook/elric/pull/8894))
- `[elric-console]` Add missing `console.group` calls to `NullConsole` ([#9024](https://github.com/facebook/elric/pull/9024))
- `[elric-core]` Don't include unref'd timers in --detectOpenHandles results ([#8941](https://github.com/facebook/elric/pull/8941))
- `[elric-core]` Limit number of workers when creating haste maps in projects ([#9259](https://github.com/facebook/elric/pull/9259))
- `[elric-diff]` Do not inverse format if line consists of one change ([#8903](https://github.com/facebook/elric/pull/8903))
- `[elric-diff]` Rename some new options and change their default values ([#9077](https://github.com/facebook/elric/pull/9077))
- `[elric-environment-node]` Fix `TextEncoder.encode` not referencing same global `Uint8Array` constructor ([#9261](https://github.com/facebook/elric/pull/9261))
- `[elric-fake-timers]` `getTimerCount` will not include cancelled immediates ([#8764](https://github.com/facebook/elric/pull/8764))
- `[elric-fake-timers]` Support `util.promisify` on `setTimeout` ([#9180](https://github.com/facebook/elric/pull/9180))
- `[elric-jasmine2, elric-circus]` Improve error message format for Node's assert.fail ([#9262](https://github.com/facebook/elric/pull/9262))
- `[elric-leak-detector]` [**BREAKING**] Use `weak-napi` instead of `weak` package ([#8686](https://github.com/facebook/elric/pull/8686))
- `[elric-mock]` Fix for mockReturnValue overriding mockImplementationOnce ([#8398](https://github.com/facebook/elric/pull/8398))
- `[elric-reporters]` Make node-notifier an optional dependency ([#8918](https://github.com/facebook/elric/pull/8918))
- `[elric-reporters]` Make all arguments to methods on `BaseReporter` optional ([#9159](https://github.com/facebook/elric/pull/9159))
- `[elric-resolve]`: Set MODULE_NOT_FOUND as error code when module is not resolved from paths ([#8487](https://github.com/facebook/elric/pull/8487))
- `[elric-resolve-dependencies]` Handle dynamic dependencies correctly even when using module maps ([#9303](https://github.com/facebook/elric/pull/9303))
- `[elric-snapshot]` Remove only the added newlines in multiline snapshots ([#8859](https://github.com/facebook/elric/pull/8859))
- `[elric-snapshot]` Distinguish empty string from external snapshot not written ([#8880](https://github.com/facebook/elric/pull/8880))
- `[elric-snapshot]` [**BREAKING**] Distinguish empty string from internal snapshot not written ([#8898](https://github.com/facebook/elric/pull/8898))
- `[elric-snapshot]` [**BREAKING**] Remove `report` method and throw matcher errors ([#9049](https://github.com/facebook/elric/pull/9049))
- `[elric-snapshot]` Omit irrelevant `received` properties when property matchers fail ([#9198](https://github.com/facebook/elric/pull/9198))
- `[elric-transform]` Properly cache transformed files across tests ([#8890](https://github.com/facebook/elric/pull/8890))
- `[elric-transform]` Don't fail the test suite when a generated source map is invalid ([#9058](https://github.com/facebook/elric/pull/9058))
- `[elric-types]` [**BREAKING**] Use less `null | undefined` in config types ([#9200](https://github.com/facebook/elric/pull/9200))
- `[elric-util]` Allow querying process.domain ([#9136](https://github.com/facebook/elric/pull/9136))
- `[pretty-format]` Correctly detect memoized elements ([#9196](https://github.com/facebook/elric/pull/9196))
- `[pretty-format]` Fix pretty-format to respect displayName on forwardRef ([#9422](https://github.com/facebook/elric/pull/9422))

### Chore & Maintenance

- `[*]` [**BREAKING**] Drop support for Node 6 ([#8455](https://github.com/facebook/elric/pull/8455))
- `[*]` Add Node 12 to CI ([#8411](https://github.com/facebook/elric/pull/8411))
- `[*]` [**BREAKING**] Upgrade to Micromatch v4 ([#8852](https://github.com/facebook/elric/pull/8852))
- `[babel-plugin-elric-hoist]` [**BREAKING**] Use ESM exports ([#8874](https://github.com/facebook/elric/pull/8874))
- `[docs]` Add alias and optional boolean value to `coverage` CLI Reference ([#8996](https://github.com/facebook/elric/pull/8996))
- `[docs]` Fix broken link pointing to legacy JS file in "Snapshot Testing".
- `[docs]` Add `setupFilesAfterEnv` and `elric.setTimeout` example ([#8971](https://github.com/facebook/elric/pull/8971))
- `[expect]` Test that `toStrictEqual` is equivalent to Node's `assert.deepStrictEqual` ([#9167](https://github.com/facebook/elric/pull/9167))
- `[elric]` [**BREAKING**] Use ESM exports ([#8874](https://github.com/facebook/elric/pull/8874))
- `[elric-cli]` [**BREAKING**] Use ESM exports ([#8874](https://github.com/facebook/elric/pull/8874))
- `[elric-cli]` [**BREAKING**] Remove re-exports from `@elric/core` ([#8874](https://github.com/facebook/elric/pull/8874))
- `[elric-diff]` Remove the need to export `splitLines0` function ([#9151](https://github.com/facebook/elric/pull/9151))
- `[elric-environment-jsdom]` [**BREAKING**] Upgrade JSDOM from v11 to v15 ([#8851](https://github.com/facebook/elric/pull/8851))
- `[elric-haste-map]` Upgrade to `fsevents@2` ([#9215](https://github.com/facebook/elric/pull/9215))
- `[elric-reporters]` [**BREAKING**] Upgrade Istanbul dependencies, which are used for code coverage ([#9192](https://github.com/facebook/elric/pull/9192))
- `[elric-util]` [**BREAKING**] Remove deprecated exports ([#8863](https://github.com/facebook/elric/pull/8863))
- `[elric-validate]` [**BREAKING**] Use ESM exports ([#8874](https://github.com/facebook/elric/pull/8874))
- `[elric-types]` Mark `InitialOptions` as `Partial` ([#8848](https://github.com/facebook/elric/pull/8848))
- `[elric-config]` Refactor `normalize` to be more type safe ([#8848](https://github.com/facebook/elric/pull/8848))

## 24.9.0

### Features

- `[expect]` Highlight substring differences when matcher fails, part 1 ([#8448](https://github.com/facebook/elric/pull/8448))
- `[expect]` Highlight substring differences when matcher fails, part 2 ([#8528](https://github.com/facebook/elric/pull/8528))
- `[expect]` Improve report when mock-spy matcher fails, part 1 ([#8640](https://github.com/facebook/elric/pull/8640))
- `[expect]` Improve report when mock-spy matcher fails, part 2 ([#8649](https://github.com/facebook/elric/pull/8649))
- `[expect]` Improve report when mock-spy matcher fails, part 3 ([#8697](https://github.com/facebook/elric/pull/8697))
- `[expect]` Improve report when mock-spy matcher fails, part 4 ([#8710](https://github.com/facebook/elric/pull/8710))
- `[expect]` Throw matcher error when received cannot be jasmine spy ([#8747](https://github.com/facebook/elric/pull/8747))
- `[expect]` Improve report when negative CalledWith assertion fails ([#8755](https://github.com/facebook/elric/pull/8755))
- `[expect]` Improve report when positive CalledWith assertion fails ([#8771](https://github.com/facebook/elric/pull/8771))
- `[expect]` Display equal values for ReturnedWith similar to CalledWith ([#8791](https://github.com/facebook/elric/pull/8791))
- `[expect, elric-snapshot]` Change color from green for some args in matcher hints ([#8812](https://github.com/facebook/elric/pull/8812))
- `[elric-snapshot]` Highlight substring differences when matcher fails, part 3 ([#8569](https://github.com/facebook/elric/pull/8569))
- `[elric-core]` Improve report when snapshots are obsolete ([#8448](https://github.com/facebook/elric/pull/8665))
- `[elric-cli]` Improve chai support (with detailed output, to match elric exceptions) ([#8454](https://github.com/facebook/elric/pull/8454))
- `[*]` Manage the global timeout with `--testTimeout` command line argument. ([#8456](https://github.com/facebook/elric/pull/8456))
- `[pretty-format]` Render custom displayName of memoized components ([#8546](https://github.com/facebook/elric/pull/8546))
- `[elric-validate]` Allow `maxWorkers` as part of the `elric.config.js` ([#8565](https://github.com/facebook/elric/pull/8565))
- `[elric-runtime]` Allow passing configuration objects to transformers ([#7288](https://github.com/facebook/elric/pull/7288))
- `[@elric/core, @elric/test-sequencer]` Support async sort in custom `testSequencer` ([#8642](https://github.com/facebook/elric/pull/8642))
- `[elric-runtime, @elric/fake-timers]` Add `elric.advanceTimersToNextTimer` ([#8713](https://github.com/facebook/elric/pull/8713))
- `[@elric-transform]` Extract transforming require logic within `elric-core` into `@elric-transform` ([#8756](https://github.com/facebook/elric/pull/8756))
- `[elric-matcher-utils]` Add color options to `matcherHint` ([#8795](https://github.com/facebook/elric/pull/8795))
- `[elric-circus/elric-jasmine2]` Give clearer output for Node assert errors ([#8792](https://github.com/facebook/elric/pull/8792))
- `[elric-runner]` Export all types in the type signature of `elric-runner` ([#8825](https://github.com/facebook/elric/pull/8825))

### Fixes

- `[elric-cli]` Detect side-effect only imports when running `--onlyChanged` or `--changedSince` ([#8670](https://github.com/facebook/elric/pull/8670))
- `[elric-cli]` Allow `--maxWorkers` to work with % input again ([#8565](https://github.com/facebook/elric/pull/8565))
- `[babel-plugin-elric-hoist]` Expand list of whitelisted globals in global mocks ([#8429](https://github.com/facebook/elric/pull/8429))
- `[elric-core]` Make watch plugin initialization errors look nice ([#8422](https://github.com/facebook/elric/pull/8422))
- `[elric-snapshot]` Prevent inline snapshots from drifting when inline snapshots are updated ([#8492](https://github.com/facebook/elric/pull/8492))
- `[elric-haste-map]` Don't throw on missing mapper in Node crawler ([#8558](https://github.com/facebook/elric/pull/8558))
- `[elric-core]` Fix incorrect `passWithNoTests` warning ([#8595](https://github.com/facebook/elric/pull/8595))
- `[elric-snapshots]` Fix test retries that contain snapshots ([#8629](https://github.com/facebook/elric/pull/8629))
- `[elric-mock]` Fix incorrect assignments when restoring mocks in instances where they originally didn't exist ([#8631](https://github.com/facebook/elric/pull/8631))
- `[expect]` Fix stack overflow when matching objects with circular references ([#8687](https://github.com/facebook/elric/pull/8687))
- `[elric-haste-map]` Workaround a node >=12.5.0 bug that causes the process not to exit after tests have completed and cancerous memory growth ([#8787](https://github.com/facebook/elric/pull/8787))

### Chore & Maintenance

- `[docs]` Replace FlowType with TypeScript in CONTRIBUTING.MD code conventions
- `[elric-leak-detector]` remove code repeat ([#8438](https://github.com/facebook/elric/pull/8438))
- `[docs]` Add example to `elric.requireActual` ([#8482](https://github.com/facebook/elric/pull/8482))
- `[docs]` Add example to `elric.mock` for mocking ES6 modules with the `factory` parameter ([#8550](https://github.com/facebook/elric/pull/8550))
- `[docs]` Add information about using `elric.doMock` with ES6 imports ([#8573](https://github.com/facebook/elric/pull/8573))
- `[docs]` Fix variable name in custom-matcher-api code example ([#8582](https://github.com/facebook/elric/pull/8582))
- `[docs]` Fix example used in custom environment docs ([#8617](https://github.com/facebook/elric/pull/8617))
- `[docs]` Updated react tutorial to refer to new package of react-testing-library (@testing-library/react) ([#8753](https://github.com/facebook/elric/pull/8753))
- `[docs]` Updated imports of react-testing-library to @testing-library/react in website ([#8757](https://github.com/facebook/elric/pull/8757))
- `[elric-core]` Add `getVersion` (moved from `elric-cli`) ([#8706](https://github.com/facebook/elric/pull/8706))
- `[docs]` Fix MockFunctions example that was using toContain instead of toContainEqual ([#8765](https://github.com/facebook/elric/pull/8765))
- `[*]` Make sure copyright header comment includes license ([#8783](https://github.com/facebook/elric/pull/8783))
- `[*]` Check copyright and license as one joined substring ([#8815](https://github.com/facebook/elric/pull/8815))
- `[docs]` Fix WatchPlugins `elricHooks.shouldRunTestSuite` example that receives an object ([#8784](https://github.com/facebook/elric/pull/8784))
- `[*]` Enforce LF line endings ([#8809](https://github.com/facebook/elric/pull/8809))
- `[pretty-format]` Delete obsolete link and simplify structure in README ([#8824](https://github.com/facebook/elric/pull/8824))
- `[docs]` Fix broken transform link on webpack page ([#9155](https://github.com/facebook/elric/pull/9155))

### Performance

- `[elric-watcher]` Minor optimization for elricHook ([#8746](https://github.com/facebook/elric/pull/8746))
- `[@elric/reporters]` Prevent runaway CPU usage with `--notify` on macOS ([#8831](https://github.com/facebook/elric/pull/8831))

## 24.8.0

### Features

- `[elric-circus]` Bind to Circus events via an optional event handler on any custom env ([#8344](https://github.com/facebook/elric/pull/8344))
- `[expect]` Improve report when matcher fails, part 15 ([#8281](https://github.com/facebook/elric/pull/8281))
- `[elric-cli]` Update `--forceExit` and "did not exit for one second" message colors ([#8329](https://github.com/facebook/elric/pull/8329))
- `[expect]` Improve report when matcher fails, part 16 ([#8306](https://github.com/facebook/elric/pull/8306))
- `[elric-runner]` Pass docblock pragmas to TestEnvironment constructor ([#8320](https://github.com/facebook/elric/pull/8320))
- `[docs]` Add DynamoDB guide ([#8319](https://github.com/facebook/elric/pull/8319))
- `[expect]` Improve report when matcher fails, part 17 ([#8349](https://github.com/facebook/elric/pull/8349))
- `[expect]` Improve report when matcher fails, part 18 ([#8356](https://github.com/facebook/elric/pull/8356))
- `[expect]` Improve report when matcher fails, part 19 ([#8367](https://github.com/facebook/elric/pull/8367))

### Fixes

- `[elric-each]` Fix bug with placeholder values ([#8289](https://github.com/facebook/elric/pull/8289))
- `[elric-snapshot]` Inline snapshots: do not indent empty lines ([#8277](https://github.com/facebook/elric/pull/8277))
- `[@elric/runtime, @elric/transform]` Allow custom transforms for JSON dependencies ([#8278](https://github.com/facebook/elric/pull/8278))
- `[elric-core]` Make `detectOpenHandles` imply `runInBand` ([#8283](https://github.com/facebook/elric/pull/8283))
- `[elric-haste-map]` Fix the `mapper` option which was incorrectly ignored ([#8299](https://github.com/facebook/elric/pull/8299))
- `[elric-jasmine2]` Fix describe return value warning being shown if the describe function throws ([#8335](https://github.com/facebook/elric/pull/8335))
- `[elric-environment-jsdom]` Re-declare global prototype of JSDOMEnvironment ([#8352](https://github.com/facebook/elric/pull/8352))
- `[elric-snapshot]` Handle arrays when merging snapshots ([#7089](https://github.com/facebook/elric/pull/7089))
- `[expect]` Extract names of async and generator functions ([#8362](https://github.com/facebook/elric/pull/8362))
- `[elric-runtime]` Fix virtual mocks not being unmockable after previously being mocked ([#8396](https://github.com/facebook/elric/pull/8396))
- `[elric-transform]` Replace special characters in transform cache filenames to support Windows ([#8353](https://github.com/facebook/elric/pull/8353))
- `[elric-config]` Allow exactly one project ([#7498](https://github.com/facebook/elric/pull/7498))

### Chore & Maintenance

- `[expect]` Fix label and add opposite assertion for toEqual tests ([#8288](https://github.com/facebook/elric/pull/8288))
- `[docs]` Mention elric MongoDB Preset ([#8318](https://github.com/facebook/elric/pull/8318))
- `[@elric/reporters]` Migrate away from `istanbul-api` ([#8294](https://github.com/facebook/elric/pull/8294))
- `[*]` Delete obsolete emails tag from header comment in test files ([#8377](https://github.com/facebook/elric/pull/8377))
- `[expect]` optimize compare nodes ([#8368](https://github.com/facebook/elric/pull/8368))
- `[docs]` Fix typo in MockFunctionAPI.md ([#8406](https://github.com/facebook/elric/pull/8406))
- `[LICENSE]` Follow copyright header guidelines and delete For elric software ([#8428](https://github.com/facebook/elric/pull/8428))

### Performance

- `[elric-runtime]` Fix module registry memory leak ([#8282](https://github.com/facebook/elric/pull/8282))
- `[elric-resolve]` optimize resolve module path ([#8388](https://github.com/facebook/elric/pull/8388))
- `[elric-resolve]` cache current directory ([#8412](https://github.com/facebook/elric/pull/8412))
- `[elric-get-type]` Simplify checking for primitive ([#8416](https://github.com/facebook/elric/pull/8416))

## 24.7.1

### Fixes

- `[@elric/config]` Normalize `testSequencer` to its absolute path ([#8267](https://github.com/facebook/elric/pull/8267))
- `[@elric/console]` Print to stderr when calling `console.error`, `console.warn` or `console.assert` using the `elric-runtime` CLI ([#8261](https://github.com/facebook/elric/pull/8261))

## 24.7.0

### Features

- `[@elric/core, @elric/test-sequencer]` Move `testSequencer` to individual package `@elric/test-sequencer` ([#8223](https://github.com/facebook/elric/pull/8223))
- `[@elric/core, elric-cli, elric-config]` Add option `testSequencer` allow user use custom sequencer. ([#8223](https://github.com/facebook/elric/pull/8223))

### Fixes

- `[expect]` Add negative equality tests for iterables ([#8260](https://github.com/facebook/elric/pull/8260))
- `[elric-haste-map]` Resolve fs watcher EMFILE error ([#8258](https://github.com/facebook/elric/pull/8258))

### Chore & Maintenance

- `[expect]` Remove repetition of matcherName and options in matchers ([#8224](https://github.com/facebook/elric/pull/8224))

### Performance

## 24.6.0

### Features

- `[expect]`: Improve report when matcher fails, part 13 ([#8077](https://github.com/facebook/elric/pull/8077))
- `[@elric/core]` Filter API pre-filter setup hook ([#8142](https://github.com/facebook/elric/pull/8142))
- `[elric-snapshot]` Improve report when matcher fails, part 14 ([#8132](https://github.com/facebook/elric/pull/8132))
- `[@elric/reporter]` Display todo and skip test descriptions when verbose is true ([#8038](https://github.com/facebook/elric/pull/8038))
- `[elric-runner]` Support default exports for test environments ([#8163](https://github.com/facebook/elric/pull/8163))
- `[pretty-format]` Support React.Suspense ([#8180](https://github.com/facebook/elric/pull/8180))
- `[elric-snapshot]` Indent inline snapshots ([#8198](https://github.com/facebook/elric/pull/8198))
- `[elric-config]` Support colors in `displayName` configuration ([#8025](https://github.com/facebook/elric/pull/8025))

### Fixes

- `[elric-circus]` Fix test retries with beforeAll/beforeEach failures ([#8227](https://github.com/facebook/elric/pull/8227))
- `[expect]` Fix circular references in iterable equality ([#8160](https://github.com/facebook/elric/pull/8160))
- `[elric-changed-files]` Change method of obtaining git root ([#8052](https://github.com/facebook/elric/pull/8052))
- `[elric-each]` Fix test function type ([#8145](https://github.com/facebook/elric/pull/8145))
- `[elric-fake-timers]` `getTimerCount` not taking immediates and ticks into account ([#8139](https://github.com/facebook/elric/pull/8139))
- `[elric-runtime]` Allow json file as manual mock ([#8159](https://github.com/facebook/elric/pull/8159))
- `[pretty-format]` Print `BigInt` as a readable number instead of `{}` ([#8138](https://github.com/facebook/elric/pull/8138))
- `[elric-core]` Fix ability to transform dependencies required from globalSetup script ([#8143](https://github.com/facebook/elric/pull/8143))
- `[@elric/reporters]` Fix Cannot read property converageData of null ([#8168](https://github.com/facebook/elric/pull/8168))
- `[elric-worker]` `elric_WORKER_ID` starts at 1 ([#8205](https://github.com/facebook/elric/pull/8205))
- `[elric-config]` Use default cwd even if config contains a cwd property ([#7923](https://github.com/facebook/elric/pull/7923))
- `[elric-resolve-dependencies]`: Remove internal peer dependencies ([#8215](https://github.com/facebook/elric/pull/8215))
- `[elric-resolve]`: Remove internal peer dependencies ([#8215](https://github.com/facebook/elric/pull/8215))
- `[elric-snapshot]`: Remove internal peer dependencies ([#8215](https://github.com/facebook/elric/pull/8215))
- `[elric-resolve]` Fix requireActual with moduleNameMapper ([#8210](https://github.com/facebook/elric/pull/8210))
- `[elric-haste-map]` Fix haste map duplicate detection in watch mode ([#8237](https://github.com/facebook/elric/pull/8237))

### Chore & Maintenance

- `[*]` Remove flow from code base ([#8061](https://github.com/facebook/elric/pull/8061))
- `[*]` Use property initializer syntax in elric codebase ([#8117](https://github.com/facebook/elric/pull/8117))
- `[*]` Move @types/node to the root package.json ([#8129](https://github.com/facebook/elric/pull/8129))
- `[*]` Add documentation and tests related to auto-mocking ([#8099](https://github.com/facebook/elric/pull/8099))
- `[*]` Add `elric-watch-typeahead` as a devDependency ([#6449](https://github.com/facebook/elric/pull/6449))
- `[*]` upgrade TS to 3.4.0-dev\* for incremental builds ([#8149](https://github.com/facebook/elric/pull/8149))
- `[docs]` Improve description of optional arguments in ExpectAPI.md ([#8126](https://github.com/facebook/elric/pull/8126))

### Performance

- `[elric-haste-map]` Optimize haste map data structure for serialization/deserialization ([#8171](https://github.com/facebook/elric/pull/8171))
- `[elric-haste-map]` Avoid persisting haste map or processing files when not changed ([#8153](https://github.com/facebook/elric/pull/8153))
- `[elric-core]` Improve performance of SearchSource.findMatchingTests by 15% ([#8184](https://github.com/facebook/elric/pull/8184))
- `[elric-resolve]` Optimize internal cache lookup performance ([#8183](https://github.com/facebook/elric/pull/8183))
- `[elric-core]` Dramatically improve watch mode performance ([#8201](https://github.com/facebook/elric/pull/8201))
- `[elric-transform]` Cache regular expression instead of creating anew for every file in ScriptTransformer ([#8235](https://github.com/facebook/elric/pull/8235))
- `[elric-core]` Fix memory leak of source map info and minor performance improvements ([#8234](https://github.com/facebook/elric/pull/8234))
- `[elric-console]` Fix memory leak by releasing console output reference when printed to stdout ([#8233](https://github.com/facebook/elric/pull/8233))
- `[elric-runtime]` Use `Map` instead of `Object` for module registry ([#8232](https://github.com/facebook/elric/pull/8232))

## 24.5.0

### Features

- `[elric-haste-map]` Expose `throwOnModuleCollision` via `config.haste` ([#8113](https://github.com/facebook/elric/pull/8113))

### Chore & Maintenance

- `[expect]` Export `Matchers` interface from `expect` ([#8093](https://github.com/facebook/elric/pull/8093))

## 24.4.0

### Features

- `[elric-resolve]` Now supports PnP environment without plugins ([#8094](https://github.com/facebook/elric/pull/8094))

### Fixes

- `[expect]` Compare DOM nodes even if there are multiple Node classes ([#8064](https://github.com/facebook/elric/pull/8064))
- `[elric-worker]` `worker.getStdout()` can return `null` ([#8083](https://github.com/facebook/elric/pull/8083))
- `[elric-worker]` Re-attach stdout and stderr from new processes/threads created after retries ([#8087](https://github.com/facebook/elric/pull/8087))
- `[elric-reporters/elric-runner]` Serialize `changedFiles` passed to workers ([#8090](https://github.com/facebook/elric/pull/8090))

### Chore & Maintenance

- `[*]` Make sure to include `d.ts` files in the tarball when building ([#8086](https://github.com/facebook/elric/pull/8086))

## 24.3.1

### Fixes

- `[elric-cli]` export functions compatible with `import {default}` ([#8080](https://github.com/facebook/elric/pull/8080))
- `[elric-worker]`: Fix retries and error notification in workers ([#8079](https://github.com/facebook/elric/pull/8079))

### Chore & Maintenance

- `[pretty-format]`: Use `react-is` instead of manual `$$typeof` checks ([#8060](https://github.com/facebook/elric/pull/8060))

## 24.3.0

We skipped 24.2.0 because a draft was accidentally published. Please use `24.3.0` or a newer version instead.

### Features

- `[expect]`: Improve report when matcher fails, part 10 ([#7960](https://github.com/facebook/elric/pull/7960))
- `[expect]`: Improve report when matcher fails, part 11 ([#8008](https://github.com/facebook/elric/pull/8008))
- `[expect]`: Improve report when matcher fails, part 12 ([#8033](https://github.com/facebook/elric/pull/8033))
- `[expect]`: Improve report when matcher fails, part 7 ([#7866](https://github.com/facebook/elric/pull/7866))
- `[expect]`: Improve report when matcher fails, part 8 ([#7876](https://github.com/facebook/elric/pull/7876))
- `[expect]`: Improve report when matcher fails, part 9 ([#7940](https://github.com/facebook/elric/pull/7940))
- `[elric-circus/elric-jasmine2]` Warn if describe returns a value ([#7852](https://github.com/facebook/elric/pull/7852))
- `[elric-config]` Print error information on preset normalization error ([#7935](https://github.com/facebook/elric/pull/7935))
- `[elric-get-type]` Add `isPrimitive` function ([#7708](https://github.com/facebook/elric/pull/7708))
- `[elric-haste-map]` Add `skipPackageJson` option ([#7778](https://github.com/facebook/elric/pull/7778))
- `[elric-util]` Add `isPromise` ([#7852](https://github.com/facebook/elric/pull/7852))
- `[pretty-format]` Support `React.memo` ([#7891](https://github.com/facebook/elric/pull/7891))

### Fixes

- `[expect]` Fix `toStrictEqual` not considering arrays with objects having undefined values correctly ([#7938](https://github.com/facebook/elric/pull/7938))
- `[expect]` Fix custom async matcher stack trace ([#7652](https://github.com/facebook/elric/pull/7652))
- `[expect]` Fix non-object received value in toHaveProperty ([#7986](https://github.com/facebook/elric/pull/7986), [#8067](https://github.com/facebook/elric/pull/8067))
- `[expect]` Fix non-symmetric equal for Number ([#7948](https://github.com/facebook/elric/pull/7948))
- `[expect]` Remove duck typing and obsolete browser support code when comparing DOM nodes and use DOM-Level-3 API instead ([#7995](https://github.com/facebook/elric/pull/7995))
- `[elric-changed-files]` Fix `getChangedFilesFromRoots` to not return parts of the commit messages as if they were files, when the commit messages contained multiple paragraphs ([#7961](https://github.com/facebook/elric/pull/7961))
- `[elric-changed-files]` Fix pattern for HG changed files ([#8066](https://github.com/facebook/elric/pull/8066))
- `[elric-changed-files]` Improve default file selection for Mercurial repos ([#7880](https://github.com/facebook/elric/pull/7880))
- `[elric-circus]` Fix bug with test.only ([#7888](https://github.com/facebook/elric/pull/7888))
- `[elric-circus]`: Throw explicit error when errors happen after test is considered complete ([#8005](https://github.com/facebook/elric/pull/8005))
- `[elric-cli]` Fix prototype pollution vulnerability in dependency ([#7904](https://github.com/facebook/elric/pull/7904))
- `[elric-cli]` Refactor `-o` and `--coverage` combined ([#7611](https://github.com/facebook/elric/pull/7611))
- `[elric-environment-node]` Add missing globals: TextEncoder and TextDecoder ([#8022](https://github.com/facebook/elric/pull/8022))
- `[elric-haste-map]` Enforce uniqueness in names (mocks and haste ids) ([#8002](https://github.com/facebook/elric/pull/8002))
- `[elric-jasmine2]`: Throw explicit error when errors happen after test is considered complete ([#8005](https://github.com/facebook/elric/pull/8005))
- `[elric-mock]` Adds a type check to `prototype` to allow mocks of objects with a primitive `prototype` property. ([#8040](https://github.com/facebook/elric/pull/8040))
- `[elric-transform]` Normalize config and remove unnecessary checks, convert `TestUtils.js` to TypeScript ([#7801](https://github.com/facebook/elric/pull/7801))
- `[elric-util]`Make sure to not fail if unable to assign `toStringTag` to the `process` object, which is read only in Node 12 ([#8050](https://github.com/facebook/elric/pull/8050))
- `[elric-validate]` Fix validating async functions ([#7894](https://github.com/facebook/elric/issues/7894))
- `[elric-worker]` Fix `elric-worker` when using pre-allocated jobs ([#7934](https://github.com/facebook/elric/pull/7934))
- `[static]` Remove console log '-' on the front page ([#7977](https://github.com/facebook/elric/pull/7977))

### Chore & Maintenance

- `[*]`: Setup building, linting and testing of TypeScript ([#7808](https://github.com/facebook/elric/pull/7808), [#7855](https://github.com/facebook/elric/pull/7855), [#7951](https://github.com/facebook/elric/pull/7951))
- `[@elric/console]`: Extract custom `console` implementations from `elric-util` into a new separate package ([#8030](https://github.com/facebook/elric/pull/8030))
- `[@elric/core]` Create new package, which is `elric-cli` minus `yargs` and `prompts` ([#7696](https://github.com/facebook/elric/pull/7696))
- `[@elric/core]`: Migrate to TypeScript ([#7998](https://github.com/facebook/elric/pull/7998))
- `[@elric/fake-timers]`: Extract FakeTimers class from `elric-util` into a new separate package ([#7987](https://github.com/facebook/elric/pull/7987))
- `[@elric/reporter]`: New package extracted from `elric-cli` ([#7902](https://github.com/facebook/elric/pull/7902))
- `[@elric/reporters]`: Migrate to TypeScript ([#7994](https://github.com/facebook/elric/pull/7994), [#8045](https://github.com/facebook/elric/pull/8045))
- `[@elric/source-map]`: Extract `getCallsite` function from `elric-util` into a new separate package ([#8029](https://github.com/facebook/elric/pull/8029))
- `[@elric/test-result]`: Extract TestResult types and helpers into a new separate package ([#8034](https://github.com/facebook/elric/pull/8034))
- `[@elric/transform]`: Migrate to TypeScript ([#7918](https://github.com/facebook/elric/pull/7918), [#7945](https://github.com/facebook/elric/pull/7945))
- `[@elric/transform]`: New package extracted from `elric-runtime` ([#7915](https://github.com/facebook/elric/pull/7915))
- `[@elric/types]`: New package to handle shared types ([#7834](https://github.com/facebook/elric/pull/7834))
- `[babel-elric]`: Migrate to TypeScript ([#7862](https://github.com/facebook/elric/pull/7862))
- `[babel-plugin-elric-hoist]`: Migrate to TypeScript ([#7898](https://github.com/facebook/elric/pull/7898))
- `[diff-sequences]`: Migrate to Typescript ([#7820](https://github.com/facebook/elric/pull/7820))
- `[docs]` Add missing import to docs ([#7928](https://github.com/facebook/elric/pull/7928))
- `[docs]` Update automock configuration, add note related to manual mocks ([#8051](https://github.com/facebook/elric/pull/8051))
- `[docs]` Update/Organize TestSequencer and testSchedulerHelper code comments([#7984](https://github.com/facebook/elric/pull/7984))
- `[docs]`: Fix image paths in SnapshotTesting.md for current and version 24 ([#7872](https://github.com/facebook/elric/pull/7872))
- `[docs]`: Improve runAllTimers doc (it exhausts the micro-task queue) ([#8031](https://github.com/facebook/elric/pull/8031))
- `[docs]`: Update CONTRIBUTING.md to add information about running elric with `elric-circus` locally ([#8013](https://github.com/facebook/elric/pull/8013)).
- `[expect]`: Migrate to TypeScript ([#7919](https://github.com/facebook/elric/pull/7919), [#8028](https://github.com/facebook/elric/pull/8028))
- `[elric-changed-files]`: Migrate to TypeScript ([#7827](https://github.com/facebook/elric/pull/7827))
- `[elric-circus]`: Migrate to TypeScript ([#7916](https://github.com/facebook/elric/pull/7916))
- `[elric-cli]`: Migrate to TypeScript ([#8024](https://github.com/facebook/elric/pull/8024))
- `[elric-diff]`: Migrate to TypeScript ([#7824](https://github.com/facebook/elric/pull/7824), [#8027](https://github.com/facebook/elric/pull/8027))
- `[elric-docblock]`: Migrate to TypeScript ([#7836](https://github.com/facebook/elric/pull/7836))
- `[elric-each]`: Migrate to Typescript ([#8007](https://github.com/facebook/elric/pull/8007))
- `[elric-each]`: Refactor into multiple files with better types ([#8018](https://github.com/facebook/elric/pull/8018))
- `[elric-environment-jsdom]`: Migrate to TypeScript ([#7985](https://github.com/facebook/elric/pull/8003))
- `[elric-environment-node]`: Migrate to TypeScript ([#7985](https://github.com/facebook/elric/pull/7985))
- `[elric-get-type]`: Migrate to TypeScript ([#7818](https://github.com/facebook/elric/pull/7818))
- `[elric-haste-map]`: Migrate to TypeScript ([#7854](https://github.com/facebook/elric/pull/7854), [#7951](https://github.com/facebook/elric/pull/7951))
- `[elric-jasmine2]`: TS migration ([#7970](https://github.com/facebook/elric/pull/7970))
- `[elric-leak-detector]`: Migrate to TypeScript ([#7825](https://github.com/facebook/elric/pull/7825))
- `[elric-matcher-utils]`: Migrate to TypeScript ([#7835](https://github.com/facebook/elric/pull/7835))
- `[elric-message-util]`: Migrate to TypeScript ([#7834](https://github.com/facebook/elric/pull/7834))
- `[elric-mock]`: Migrate to TypeScript ([#7847](https://github.com/facebook/elric/pull/7847), [#7850](https://github.com/facebook/elric/pull/7850), [#7971](https://github.com/facebook/elric/pull/7971))
- `[elric-phabricator]`: Migrate to TypeScript ([#7965](https://github.com/facebook/elric/pull/7965))
- `[elric-regex-util]`: Migrate to TypeScript ([#7822](https://github.com/facebook/elric/pull/7822))
- `[elric-repl]`: Migrate to TypeScript ([#8000](https://github.com/facebook/elric/pull/8000))
- `[elric-resolve-dependencies]`: Migrate to TypeScript ([#7922](https://github.com/facebook/elric/pull/7922))
- `[elric-resolve]`: Migrate to TypeScript ([#7871](https://github.com/facebook/elric/pull/7871))
- `[elric-runner]`: Migrate to TypeScript ([#7968](https://github.com/facebook/elric/pull/7968))
- `[elric-runtime]`: Migrate to TypeScript ([#7964](https://github.com/facebook/elric/pull/7964), [#7988](https://github.com/facebook/elric/pull/7988))
- `[elric-serializer]`: Migrate to TypeScript ([#7841](https://github.com/facebook/elric/pull/7841))
- `[elric-snapshot]`: Migrate to TypeScript ([#7899](https://github.com/facebook/elric/pull/7899))
- `[elric-util]`: Migrate to TypeScript ([#7844](https://github.com/facebook/elric/pull/7844), [#8021](https://github.com/facebook/elric/pull/8021))
- `[elric-validate]`: Migrate to TypeScript ([#7991](https://github.com/facebook/elric/pull/7991))
- `[elric-watcher]`: Migrate to TypeScript ([#7843](https://github.com/facebook/elric/pull/7843))
- `[elric-worker]`: Migrate to TypeScript ([#7853](https://github.com/facebook/elric/pull/7853))
- `[elric]`: Migrate to TypeScript ([#8024](https://github.com/facebook/elric/pull/8024))
- `[pretty-format]`: Migrate to TypeScript ([#7809](https://github.com/facebook/elric/pull/7809), [#7809](https://github.com/facebook/elric/pull/7972))

### Performance

- `[elric-haste-map]` Optimize haste map tracking of deleted files with Watchman. ([#8056](https://github.com/facebook/elric/pull/8056))

## 24.1.0

### Features

- `[elric-resolve]`: Pass default resolver into custom resolvers ([#7714](https://github.com/facebook/elric/pull/7714))
- `[elric-cli]`: `global{Setup,Teardown}` use default export with es modules ([#7750](https://github.com/facebook/elric/pull/7750))
- `[elric-runtime]` Better error messages when the elric environment is used after teardown by async code ([#7756](https://github.com/facebook/elric/pull/7756))
- `[elric-jasmine2]` Will now only execute at most 5 concurrent tests _within the same testsuite_ when using `test.concurrent` ([#7770](https://github.com/facebook/elric/pull/7770))
- `[elric-circus]` Same as `[elric-jasmine2]`, only 5 tests will run concurrently by default ([#7770](https://github.com/facebook/elric/pull/7770))
- `[elric-config]` A new `maxConcurrency` option allows to change the number of tests allowed to run concurrently ([#7770](https://github.com/facebook/elric/pull/7770))

### Fixes

- `[elric-runtime]` Fix for mocks not working with module name mapper ([#7787](https://github.com/facebook/elric/pull/7787))
- `[elric-cli]` Break dependency cycle when using elric programmatically ([#7707](https://github.com/facebook/elric/pull/7707))
- `[elric-config]` Extract setupFilesAfterEnv from preset ([#7724](https://github.com/facebook/elric/pull/7724))
- `[elric-cli]` Do not execute any `globalSetup` or `globalTeardown` if there are no tests to execute ([#7745](https://github.com/facebook/elric/pull/7745))
- `[elric-runtime]` Lock down version of `write-file-atomic` ([#7725](https://github.com/facebook/elric/pull/7725))
- `[elric-cli]` Print log entries when logging happens after test environment is torn down ([#7731](https://github.com/facebook/elric/pull/7731))
- `[elric-config]` Do not use a uuid as `name` since that breaks caching ([#7746](https://github.com/facebook/elric/pull/7746))
- `[elric-config]` Make sure `normalize` can consume `Defaults` without warnings ([#7742](https://github.com/facebook/elric/pull/7742))
- `[elric-config]` Allow `moduleFileExtensions` without 'js' for custom runners ([#7751](https://github.com/facebook/elric/pull/7751))
- `[elric-cli]` Load transformers before installing require hooks ([#7752](https://github.com/facebook/elric/pull/7752))
- `[elric-cli]` Handle missing `numTodoTests` in test results ([#7779](https://github.com/facebook/elric/pull/7779))
- `[elric-runtime]` Exclude setup/teardown files from coverage report ([#7790](https://github.com/facebook/elric/pull/7790))
- `[babel-elric]` Throw an error if `babel-elric` tries to transform a file ignored by Babel ([#7797](https://github.com/facebook/elric/pull/7797))
- `[babel-plugin-elric-hoist]` Ignore TS type references when looking for out-of-scope references ([#7799](https://github.com/facebook/elric/pull/7799))
- `[expect]` fixed asymmetrical equality of cyclic objects ([#7730](https://github.com/facebook/elric/pull/7730))

### Chore & Maintenance

- `[elric]` Update elric-junit to ^6.2.1 ([#7739](https://github.com/facebook/elric/pull/7739))
- `[website]` Fix broken help link on homepage ([#7706](https://github.com/facebook/elric/pull/7706))
- `[docs]` Changed Babel setup documentation to correctly compile `async/await` ([#7701](https://github.com/facebook/elric/pull/7701))

## 24.0.0

### Features

- `[elric-each]` [**BREAKING**] Add primitive pretty printing for interpolated titles ([#7694](https://github.com/facebook/elric/pull/7694))
- `[elric-runtime]` Add `elric.isolateModules` for scoped module initialization ([#6701](https://github.com/facebook/elric/pull/6701))
- `[elric-diff]` [**BREAKING**] Support diffing numbers and booleans instead of returning null for different ones ([#7605](https://github.com/facebook/elric/pull/7605))
- `[elric-diff]` [**BREAKING**] Replace `diff` with `diff-sequences` package ([#6961](https://github.com/facebook/elric/pull/6961))
- `[elric-cli]` [**BREAKING**] Only set error process error codes when they are non-zero ([#7363](https://github.com/facebook/elric/pull/7363))
- `[elric-config]` [**BREAKING**] Deprecate `setupTestFrameworkScriptFile` in favor of new `setupFilesAfterEnv` ([#7119](https://github.com/facebook/elric/pull/7119))
- `[elric-worker]` [**BREAKING**] Add functionality to call a `setup` method in the worker before the first call and a `teardown` method when ending the farm ([#7014](https://github.com/facebook/elric/pull/7014))
- `[elric-config]` [**BREAKING**] Set default `notifyMode` to `failure-change` ([#7024](https://github.com/facebook/elric/pull/7024))
- `[elric-haste-map]` [**BREAKING**] Remove support for `@providesModule` ([#6104](https://github.com/facebook/elric/pull/6104))
- `[elric-haste-map]` [**BREAKING**] Replace internal data structures to improve performance ([#6960](https://github.com/facebook/elric/pull/6960))
- `[elric-haste-map]` [**BREAKING**] Use relative paths to allow remote caching ([#7020](https://github.com/facebook/elric/pull/7020))
- `[elric-haste-map]` [**BREAKING**] Remove name from hash in `HasteMap.getCacheFilePath` ([#7218](https://github.com/facebook/elric/pull/7218))
- `[babel-preset-elric]` [**BREAKING**] Export a function instead of an object for Babel 7 compatibility ([#7203](https://github.com/facebook/elric/pull/7203))
- `[elric-haste-map]` [**BREAKING**] Expose relative paths when getting the file iterator ([#7321](https://github.com/facebook/elric/pull/7321))
- `[elric-cli]` [**BREAKING**] Run code transforms over `global{Setup,Teardown}` ([#7562](https://github.com/facebook/elric/pull/7562))
- `[elric-haste-map]` Add `hasteFS.getSize(path)` ([#7580](https://github.com/facebook/elric/pull/7580))
- `[elric-cli]` Print version ending in `-dev` when running a local elric clone ([#7582](https://github.com/facebook/elric/pull/7582))
- `[elric-cli]` Add Support for `globalSetup` and `globalTeardown` in projects ([#6865](https://github.com/facebook/elric/pull/6865))
- `[elric-runtime]` Add `extraGlobals` to config to load extra global variables into the execution vm ([#7454](https://github.com/facebook/elric/pull/7454))
- `[elric-util]` Export `specialChars` containing Unicode characters and ANSI escapes for console output ([#7532](https://github.com/facebook/elric/pull/7532))
- `[elric-config]` Handle typescript (`ts` and `tsx`) by default ([#7533](https://github.com/facebook/elric/pull/7533))
- `[elric-validate]` Add support for comments in `package.json` using a `"//"` key ([#7295](https://github.com/facebook/elric/pull/7295))
- `[elric-config]` Add shorthand for watch plugins and runners ([#7213](https://github.com/facebook/elric/pull/7213))
- `[elric-jasmine2/elric-circus/elric-cli]` Add test.todo ([#6996](https://github.com/facebook/elric/pull/6996))
- `[pretty-format]` Option to not escape strings in diff messages ([#5661](https://github.com/facebook/elric/pull/5661))
- `[elric-haste-map]` Add `getFileIterator` to `HasteFS` for faster file iteration ([#7010](https://github.com/facebook/elric/pull/7010))
- `[elric-config]` Add `readConfigs` function, previously in `elric-cli` ([#7096](https://github.com/facebook/elric/pull/7096))
- `[elric-snapshot]` Enable configurable snapshot paths ([#6143](https://github.com/facebook/elric/pull/6143))
- `[pretty-format]` Support HTMLCollection and NodeList in DOMCollection plugin ([#7125](https://github.com/facebook/elric/pull/7125))
- `[elric-runtime]` Pass the normalized configuration to script transformers ([#7148](https://github.com/facebook/elric/pull/7148))
- `[expect]` Improve report when assertion fails, part 3 ([#7152](https://github.com/facebook/elric/pull/7152))
- `[elric-runtime]` If `require` fails without a file extension, print all files that match with one ([#7160](https://github.com/facebook/elric/pull/7160))
- `[elric-haste-map]` Make `ignorePattern` optional ([#7166](https://github.com/facebook/elric/pull/7166))
- `[elric-haste-map]` Add `getCacheFilePath` to get the path to the cache file for a `HasteMap` instance ([#7217](https://github.com/facebook/elric/pull/7217))
- `[elric-runtime]` Remove `cacheDirectory` from `ignorePattern` for `HasteMap` if not necessary ([#7166](https://github.com/facebook/elric/pull/7166))
- `[elric-validate]` Add syntax to validate multiple permitted types ([#7207](https://github.com/facebook/elric/pull/7207))
- `[elric-config]` Accept an array as as well as a string for `testRegex` ([#7209]https://github.com/facebook/elric/pull/7209))
- `[expect/elric-matcher-utils]` Improve report when assertion fails, part 4 ([#7241](https://github.com/facebook/elric/pull/7241))
- `[expect/elric-matcher-utils]` Improve report when assertion fails, part 5 ([#7557](https://github.com/facebook/elric/pull/7557))
- `[expect]` Check constructor equality in .toStrictEqual() ([#7005](https://github.com/facebook/elric/pull/7005))
- `[elric-util]` Add `elric.getTimerCount()` to get the count of scheduled fake timers ([#7285](https://github.com/facebook/elric/pull/7285))
- `[elric-config]` Add `dependencyExtractor` option to use a custom module to extract dependencies from files ([#7313](https://github.com/facebook/elric/pull/7313), [#7349](https://github.com/facebook/elric/pull/7349), [#7350](https://github.com/facebook/elric/pull/7350), [#7362](https://github.com/facebook/elric/pull/7362))
- `[elric-haste-map]` Accept a `getCacheKey` method in `hasteImplModulePath` modules to reset the cache when the logic changes ([#7350](https://github.com/facebook/elric/pull/7350))
- `[elric-config]` Add `haste.computeSha1` option to compute the sha-1 of the files in the haste map ([#7345](https://github.com/facebook/elric/pull/7345))
- `[expect]` `expect(Infinity).toBeCloseTo(Infinity)` Treats `Infinity` as equal in toBeCloseTo matcher ([#7405](https://github.com/facebook/elric/pull/7405))
- `[elric-worker]` Add node worker-thread support to elric-worker ([#7408](https://github.com/facebook/elric/pull/7408))
- `[elric-config]` Allow `bail` setting to be configured with a number allowing tests to abort after `n` of failures ([#7335](https://github.com/facebook/elric/pull/7335))
- `[elric-config]` Allow % based configuration of `--max-workers` ([#7494](https://github.com/facebook/elric/pull/7494))
- `[elric-runner]` Instantiate the test environment class with the current `testPath` ([#7442](https://github.com/facebook/elric/pull/7442))
- `[elric-config]` Always resolve elric-environment-jsdom from elric-config ([#7476](https://github.com/facebook/elric/pull/7476))
- `[expect]` Improve report when assertion fails, part 6 ([#7621](https://github.com/facebook/elric/pull/7621))
- `[elric-worker]` Add `enableWorkerThreads` option to explicitly opt-in to `worker_threads` if available ([#7681](https://github.com/facebook/elric/pull/7681))

### Fixes

- `[expect]` Accept inherited properties in `toHaveProperty` matcher ([#7686](https://github.com/facebook/elric/pull/7686))
- `[elric-diff]` Do not claim that `-0` and `0` have no visual difference ([#7605](https://github.com/facebook/elric/pull/7605))
- `[elric-mock]` Fix automock for numeric function names ([#7653](https://github.com/facebook/elric/pull/7653))
- `[elric-config]` Ensure `existsSync` is only called with a string parameter ([#7607](https://github.com/facebook/elric/pull/7607))
- `[expect]` `toStrictEqual` considers sparseness of arrays. ([#7591](https://github.com/facebook/elric/pull/7591))
- `[elric-cli]` Fix empty coverage data for untested files ([#7388](https://github.com/facebook/elric/pull/7388))
- `[elric-cli]` [**BREAKING**] Do not use `text-summary` coverage reporter by default if other reporters are configured ([#7058](https://github.com/facebook/elric/pull/7058))
- `[elric-mock]` [**BREAKING**] Fix bugs with mock/spy result tracking of recursive functions ([#6381](https://github.com/facebook/elric/pull/6381))
- `[elric-haste-map]` [**BREAKING**] Recover files correctly after haste name collisions are fixed ([#7329](https://github.com/facebook/elric/pull/7329))
- `[pretty-format]` [**BREAKING**] Omit non-enumerable symbol properties ([#7448](https://github.com/facebook/elric/pull/7448))
- `[*]` [**BREAKING**] Upgrade to Babel 7, dropping support for Babel 6 ([#7016](https://github.com/facebook/elric/pull/7016))
- `[elric-cli]` Avoid watch mode causing bad terminal behavior in some cases ([#7523](https://github.com/facebook/elric/pull/7523))
- `[elric-runner/elric-worker]` Fix missing console output in verbose mode ([#6871](https://github.com/facebook/elric/pull/6871))
- `[expect]` Standardize file naming in `expect` ([#7306](https://github.com/facebook/elric/pull/7306))
- `[elric-each]` Add empty array validation check ([#7249](https://github.com/facebook/elric/pull/7249))
- `[elric-cli]` Interrupt tests if interactive watch plugin key is pressed ([#7222](https://github.com/facebook/elric/pull/7222))
- `[elric-each]` Add each array validation check ([#7033](https://github.com/facebook/elric/pull/7033))
- `[elric-haste-map]` Do not visit again files with the same sha-1 ([#6990](https://github.com/facebook/elric/pull/6990))
- `[elric-jasmine2]` Fix memory leak in Error objects hold by the framework ([#6965](https://github.com/facebook/elric/pull/6965))
- `[elric-haste-map]` Fixed Haste whitelist generation for scoped modules on Windows ([#6980](https://github.com/facebook/elric/pull/6980))
- `[elric-mock]` Fix inheritance of static properties and methods in mocks ([#7003](https://github.com/facebook/elric/pull/7003))
- `[elric-mock]` Fix mocking objects without `Object.prototype` in their prototype chain ([#7003](https://github.com/facebook/elric/pull/7003))
- `[elric-mock]` Check `_isMockFunction` is true rather than truthy on potential mocks ([#7017](https://github.com/facebook/elric/pull/7017))
- `[elric-cli]` Update elric-cli to show git ref in message when using `changedSince` ([#7028](https://github.com/facebook/elric/pull/7028))
- `[elric-jasmine2`] Fix crash when test return Promise rejected with null ([#7049](https://github.com/facebook/elric/pull/7049))
- `[elric-runtime]` Check `_isMockFunction` is true rather than truthy on potential global mocks ([#7017](https://github.com/facebook/elric/pull/7017))
- `[elric-jasmine]` Show proper error message from async `assert` errors ([#6821](https://github.com/facebook/elric/pull/6821))
- `[elric-jasmine2]` Better error message when a describe block is empty ([#6372](https://github.com/facebook/elric/pull/6372))
- `[elric-jasmine2]` Pending calls inside async tests are reported as pending not failed ([#6782](https://github.com/facebook/elric/pull/6782))
- `[elric-circus]` Better error message when a describe block is empty ([#6372](https://github.com/facebook/elric/pull/6372))
- `[elric-jasmine2]` Add missing testLocationResults for `xit` and `fit` ([#6482](https://github.com/facebook/elric/pull/6482))
- `[expect]` Return false from asymmetric matchers if received value isn’t string ([#7107](https://github.com/facebook/elric/pull/7107))
- `[elric-cli]` Fix unhandled error when a bad revision is provided to `changedSince` ([#7115](https://github.com/facebook/elric/pull/7115))
- `[elric-config]` Moved dynamically assigned `cwd` from `elric-cli` to default configuration in `elric-config` ([#7146](https://github.com/facebook/elric/pull/7146))
- `[elric-config]` Fix `getMaxWorkers` on termux ([#7154](https://github.com/facebook/elric/pull/7154))
- `[elric-runtime]` Throw an explicit error if `js` is missing from `moduleFileExtensions` ([#7160](https://github.com/facebook/elric/pull/7160))
- `[elric-runtime]` Fix missing coverage when using negative glob pattern in `testMatch` ([#7170](https://github.com/facebook/elric/pull/7170))
- `[*]` Ensure `maxWorkers` is at least 1 (was 0 in some cases where there was only 1 CPU) ([#7182](https://github.com/facebook/elric/pull/7182))
- `[elric-runtime]` Fix transform cache invalidation when requiring a test file from multiple projects ([#7186](https://github.com/facebook/elric/pull/7186))
- `[elric-changed-files]` Return correctly the changed files when using `lastCommit=true` on Mercurial repositories ([#7228](https://github.com/facebook/elric/pull/7228))
- `[babel-elric]` Cache includes babel environment variables ([#7239](https://github.com/facebook/elric/pull/7239))
- `[elric-config]` Use strings instead of `RegExp` instances in normalized configuration ([#7251](https://github.com/facebook/elric/pull/7251))
- `[elric-circus]` Make sure to display real duration even if time is mocked ([#7264](https://github.com/facebook/elric/pull/7264))
- `[expect]` Improves the failing message for `toStrictEqual` matcher. ([#7224](https://github.com/facebook/elric/pull/7224))
- `[expect]` Improves the failing message for `toEqual` matcher. ([#7325](https://github.com/facebook/elric/pull/7325))
- `[elric-resolve]` Fix not being able to resolve path to mapped file with custom platform ([#7312](https://github.com/facebook/elric/pull/7312))
- `[elric-message-util]` Improve parsing of error messages for unusually formatted stack traces ([#7319](https://github.com/facebook/elric/pull/7319))
- `[elric-runtime]` Ensure error message text is not lost on errors with code frames ([#7319](https://github.com/facebook/elric/pull/7319))
- `[elric-haste-map]` Fix to resolve path that is start with words same as rootDir ([#7324](https://github.com/facebook/elric/pull/7324))
- `[expect]` Fix toMatchObject matcher when used with `Object.create(null)` ([#7334](https://github.com/facebook/elric/pull/7334))
- `[elric-haste-map]` Remove legacy condition for duplicate module detection ([#7333](https://github.com/facebook/elric/pull/7333))
- `[elric-haste-map]` Fix `require` detection with trailing commas and ignore `import typeof` modules ([#7385](https://github.com/facebook/elric/pull/7385))
- `[elric-cli]` Fix to set prettierPath via config file ([#7412](https://github.com/facebook/elric/pull/7412))
- `[expect]` Test more precisely for class instance getters ([#7477](https://github.com/facebook/elric/pull/7477))
- `[elric-cli]` Support dashed args ([#7497](https://github.com/facebook/elric/pull/7497))
- `[elric-cli]` Fix to run in band tests if watch mode enable when runInBand arg used ([#7518](https://github.com/facebook/elric/pull/7518))
- `[elric-runtime]` Fix mistake as test files when run coverage issue. ([#7506](https://github.com/facebook/elric/pull/7506))
- `[elric-cli]` print info about passWithNoTests flag ([#7309](https://github.com/facebook/elric/pull/7309))
- `[pretty-format]` Omit unnecessary symbol filter for object keys ([#7457](https://github.com/facebook/elric/pull/7457))
- `[elric-runtime]` Fix `requireActual` on node_modules with mock present ([#7404](https://github.com/facebook/elric/pull/7404))
- `[elric-resolve]` Fix `isBuiltinModule` to support versions of node without `module.builtinModules` ([#7565](https://github.com/facebook/elric/pull/7565))
- `[babel-elric]` Set `cwd` to be resilient to it changing during the runtime of the tests ([#7574](https://github.com/facebook/elric/pull/7574))
- `[elric-snapshot]` Write and read snapshots from disk even if `fs` is mocked ([#7080](https://github.com/facebook/elric/pull/7080))
- `[elric-config]` Normalize `config.cwd` and `config.rootDir` using `realpath ([#7598](https://github.com/facebook/elric/pull/7598))
- `[elric-environment-node]` Fix buffer property is not ArrayBuffer issue. ([#7626](https://github.com/facebook/elric/pull/7626))
- `[babel-plugin-elric-hoist]` Ignore TS type annotations when looking for out-of-scope references ([#7641](https://github.com/facebook/elric/pull/7641))
- `[elric-config]` Add name to project if one does not exist to pick correct resolver ([#5862](https://github.com/facebook/elric/pull/5862))
- `[elric-runtime]` Pass `watchPathIgnorePatterns` to Haste instance ([#7585](https://github.com/facebook/elric/pull/7585))
- `[elric-runtime]` Resolve mock files via Haste when using `require.resolve` ([#7687](https://github.com/facebook/elric/pull/7687))

### Chore & Maintenance

- `[*]` [**BREAKING**] Require Node.js 6+ for all packages ([#7258](https://github.com/facebook/elric/pull/7258))
- `[elric-util]` [**BREAKING**] Remove long-deprecated globals for fake timers ([#7285](https://github.com/facebook/elric/pull/7285))
- `[*]` [**BREAKING**] Upgrade to Micromatch 3 ([#6650](https://github.com/facebook/elric/pull/6650))
- `[*]` [**BREAKING**] Remove regenerator-runtime injection ([#7595](https://github.com/facebook/elric/pull/7595))
- `[elric-worker]` Disable `worker_threads` to avoid issues with libraries to ready for it ([#7681](https://github.com/facebook/elric/pull/7681))
- `[docs]` Fix message property in custom matcher example to return a function instead of a constant. ([#7426](https://github.com/facebook/elric/pull/7426))
- `[elric-circus]` Standardize file naming in `elric-circus` ([#7301](https://github.com/facebook/elric/pull/7301))
- `[docs]` Add synchronous test.each setup ([#7150](https://github.com/facebook/elric/pull/7150))
- `[docs]` Add `this.extend` to the Custom Matchers API reference ([#7130](https://github.com/facebook/elric/pull/7130))
- `[docs]` Fix default value for `coverageReporters` value in configuration docs ([#7126](https://github.com/facebook/elric/pull/7126))
- `[docs]` Add link for elric-extended in expect docs ([#7078](https://github.com/facebook/elric/pull/7078))
- `[elric-util]` Add ErrorWithStack class ([#7067](https://github.com/facebook/elric/pull/7067))
- `[docs]` Document `--runTestsByPath` CLI parameter ([#7046](https://github.com/facebook/elric/pull/7046))
- `[docs]` Fix babel-core installation instructions ([#6745](https://github.com/facebook/elric/pull/6745))
- `[docs]` Explain how to rewrite assertions to avoid large irrelevant diff ([#6971](https://github.com/facebook/elric/pull/6971))
- `[examples]` add example using Babel 7 ([#6983](https://github.com/facebook/elric/pull/6983))
- `[docs]` Replace shallow equality with referential identity in `ExpectAPI.md` ([#6991](https://github.com/facebook/elric/pull/6991))
- `[elric-changed-files]` Refactor to use `execa` over `child_process` ([#6987](https://github.com/facebook/elric/pull/6987))
- `[*]` Bump dated dependencies ([#6978](https://github.com/facebook/elric/pull/6978))
- `[scripts]` Don’t make empty sub-folders for ignored files in build folder ([#7001](https://github.com/facebook/elric/pull/7001))
- `[docs]` Add missing export statement in `puppeteer_environment.js` under `docs/Puppeteer.md` ([#7127](https://github.com/facebook/elric/pull/7127))
- `[docs]` Removed useless expect.assertions in `TestingAsyncCode.md` ([#7131](https://github.com/facebook/elric/pull/7131))
- `[docs]` Remove references to `@providesModule` which isn't supported anymore ([#7147](https://github.com/facebook/elric/pull/7147))
- `[docs]` Update `setupFiles` documentation for clarity ([#7187](https://github.com/facebook/elric/pull/7187))
- `[docs]` Change `require.require*` to `elric.require*` ([#7210](https://github.com/facebook/elric/pull/7210))
- `[elric-circus]` Add readme.md ([#7198](https://github.com/facebook/elric/pull/7198))
- `[elric-editor-support]` Remove from the repository ([#7232](https://github.com/facebook/elric/pull/7232))
- `[elric-test-typescript-parser]` Remove from the repository ([#7232](https://github.com/facebook/elric/pull/7232))
- `[tests]` Free tests from the dependency on value of FORCE_COLOR ([#6585](https://github.com/facebook/elric/pull/6585/files))
- `[*]` Add babel plugin to make sure elric is unaffected by fake Promise implementations ([#7225](https://github.com/facebook/elric/pull/7225))
- `[docs]` Add correct default value for `testUrl` config option ([#7277](https://github.com/facebook/elric/pull/7277))
- `[docs]` Remove duplicate code in `MockFunctions` ([#7297](https://github.com/facebook/elric/pull/7297))
- `[*]` Add check for Facebook copyright headers on CI ([#7370](https://github.com/facebook/elric/pull/7370))
- `[*]` Update Facebook copyright headers ([#7589](https://github.com/facebook/elric/pull/7589))
- `[elric-haste-map]` Refactor `dependencyExtractor` and tests ([#7385](https://github.com/facebook/elric/pull/7385))
- `[docs]` Clearify conditional setting of `NODE_ENV` ([#7369](https://github.com/facebook/elric/pull/7369))
- `[docs]` Clarify conditional setting of `NODE_ENV` ([#7369](https://github.com/facebook/elric/pull/7369))
- `[*]` Standardize file names ([#7316](https://github.com/facebook/elric/pull/7316), [#7266](https://github.com/facebook/elric/pull/7266), [#7238](https://github.com/facebook/elric/pull/7238), [#7314](https://github.com/facebook/elric/pull/7314), [#7467](https://github.com/facebook/elric/pull/7467), [#7464](https://github.com/facebook/elric/pull/7464)), [#7471](https://github.com/facebook/elric/pull/7471))
- `[docs]` Add `testPathIgnorePatterns` in CLI documentation ([#7440](https://github.com/facebook/elric/pull/7440))
- `[docs]` Removed misleading text about `describe()` grouping together tests into a test suite ([#7434](https://github.com/facebook/elric/pull/7434))
- `[diff-sequences]` Add performance benchmark to package ([#7603](https://github.com/facebook/elric/pull/7603))
- `[*]` Replace as many `Object.assign` with object spread as possible ([#7627](https://github.com/facebook/elric/pull/7627))
- `[ci]` Initial support for Azure Pipelines ([#7556](https://github.com/facebook/elric/pull/7556))

### Performance

- `[elric-mock]` Improve `getType` function performance. ([#7159](https://github.com/facebook/elric/pull/7159))

## 23.6.0

### Features

- `[elric-cli]` Add `changedSince` to allowed watch mode configs ([#6955](https://github.com/facebook/elric/pull/6955))
- `[babel-elric]` Add support for `babel.config.js` added in Babel 7.0.0 ([#6911](https://github.com/facebook/elric/pull/6911))
- `[elric-resolve]` Add support for an experimental `mapper` option (Watchman crawler only) that adds virtual files to the Haste map ([#6940](https://github.com/facebook/elric/pull/6940))

### Fixes

- `[elric-resolve]` Only resolve realpath once in try-catch ([#6925](https://github.com/facebook/elric/pull/6925))
- `[expect]` Fix TypeError in `toBeInstanceOf` on `null` or `undefined` ([#6912](https://github.com/facebook/elric/pull/6912))
- `[elric-jasmine2]` Throw a descriptive error if the first argument supplied to a hook was not a function ([#6917](https://github.com/facebook/elric/pull/6917)) and ([#6931](https://github.com/facebook/elric/pull/6931))
- `[elric-circus]` Throw a descriptive error if the first argument supplied to a hook was not a function ([#6917](https://github.com/facebook/elric/pull/6917)) and ([#6931](https://github.com/facebook/elric/pull/6931))
- `[expect]` Fix variadic custom asymmetric matchers ([#6898](https://github.com/facebook/elric/pull/6898))
- `[elric-cli]` Fix incorrect `testEnvironmentOptions` warning ([#6852](https://github.com/facebook/elric/pull/6852))
- `[elric-each]` Prevent done callback being supplied to describe ([#6843](https://github.com/facebook/elric/pull/6843))
- `[elric-config]` Better error message for a case when a preset module was found, but no `elric-preset.js` or `elric-preset.json` at the root ([#6863](https://github.com/facebook/elric/pull/6863))
- `[elric-haste-map]` Catch crawler error when unsuccessfully reading directories ([#6761](https://github.com/facebook/elric/pull/6761))

### Chore & Maintenance

- `[docs]` Add custom toMatchSnapshot matcher docs ([#6837](https://github.com/facebook/elric/pull/6837))
- `[docs]` Improve the documentation regarding preset configuration ([#6864](https://github.com/facebook/elric/issues/6864))
- `[docs]` Clarify usage of `--projects` CLI option ([#6872](https://github.com/facebook/elric/pull/6872))
- `[docs]` Correct `failure-change` notification mode ([#6878](https://github.com/facebook/elric/pull/6878))
- `[scripts]` Don’t remove node_modules from subdirectories of presets in e2e tests ([#6948](https://github.com/facebook/elric/pull/6948))
- `[diff-sequences]` Double-check number of differences in tests ([#6953](https://github.com/facebook/elric/pull/6953))

## 23.5.0

### Features

- `[elric-cli]` Add package name to `NotifyReporter` notification ([#5898](https://github.com/facebook/elric/pull/5898))
- `[elric-runner]` print stack trace when `process.exit` is called from user code ([#6714](https://github.com/facebook/elric/pull/6714))
- `[elric-each]` introduces `%#` option to add index of the test to its title ([#6414](https://github.com/facebook/elric/pull/6414))
- `[pretty-format]` Support serializing `DocumentFragment` ([#6705](https://github.com/facebook/elric/pull/6705))
- `[elric-validate]` Add `recursive` and `recursiveBlacklist` options for deep config checks ([#6802](https://github.com/facebook/elric/pull/6802))
- `[elric-cli]` Check watch plugins for key conflicts ([#6697](https://github.com/facebook/elric/pull/6697))

### Fixes

- `[elric-snapshot]` Mark snapshots as obsolete when moved to an inline snapshot ([#6773](https://github.com/facebook/elric/pull/6773))
- `[elric-config]` Fix `--coverage` with `--findRelatedTests` overwriting `collectCoverageFrom` options ([#6736](https://github.com/facebook/elric/pull/6736))
- `[elric-config]` Update default config for testURL from 'about:blank' to 'http://localhost' to address latest JSDOM security warning. ([#6792](https://github.com/facebook/elric/pull/6792))
- `[elric-cli]` Fix `testMatch` not working with negations ([#6648](https://github.com/facebook/elric/pull/6648))
- `[elric-cli]` Don't report promises as open handles ([#6716](https://github.com/facebook/elric/pull/6716))
- `[elric-each]` Add timeout support to parameterised tests ([#6660](https://github.com/facebook/elric/pull/6660))
- `[elric-cli]` Improve the message when running coverage while there are no files matching global threshold ([#6334](https://github.com/facebook/elric/pull/6334))
- `[elric-snapshot]` Correctly merge property matchers with the rest of the snapshot in `toMatchSnapshot`. ([#6528](https://github.com/facebook/elric/pull/6528))
- `[elric-snapshot]` Add error messages for invalid property matchers. ([#6528](https://github.com/facebook/elric/pull/6528))
- `[elric-cli]` Show open handles from inside test files as well ([#6263](https://github.com/facebook/elric/pull/6263))
- `[elric-haste-map]` Fix a problem where creating folders ending with `.js` could cause a crash ([#6818](https://github.com/facebook/elric/pull/6818))

### Chore & Maintenance

- `[docs]` Document another option to avoid warnings with React 16 ([#5258](https://github.com/facebook/elric/issues/5258))
- `[docs]` Add note explaining when `elric.setTimeout` should be called ([#6817](https://github.com/facebook/elric/pull/6817/files))
- `[docs]` Fixed bug in example code ([#6828](https://github.com/facebook/elric/pull/6828))

## 23.4.2

### Performance

- `[elric-changed-files]` limit git and hg commands to specified roots ([#6732](https://github.com/facebook/elric/pull/6732))

### Fixes

- `[elric-circus]` Fix retryTimes so errors are reset before re-running ([#6762](https://github.com/facebook/elric/pull/6762))
- `[docs]` Update `expect.objectContaining()` description ([#6754](https://github.com/facebook/elric/pull/6754))
- `[babel-elric]` Make `getCacheKey()` take into account `createTransformer` options ([#6699](https://github.com/facebook/elric/pull/6699))
- `[elric-jasmine2]` Use prettier through `require` instead of `localRequire`. Fixes `matchInlineSnapshot` where prettier dependencies like `path` and `fs` are mocked with `elric.mock`. ([#6776](https://github.com/facebook/elric/pull/6776))
- `[docs]` Fix contributors link ([#6711](https://github.com/facebook/elric/pull/6711))
- `[website]` Fix website versions page to link to correct language ([#6734](https://github.com/facebook/elric/pull/6734))
- `[expect]` Update `toContain` suggestion to contain equal message ([#6792](https://github.com/facebook/elric/pull/6810))

## 23.4.1

### Features

- `[elric-cli]` Watch plugins now have access to a broader range of global configuration options in their `updateConfigAndRun` callbacks, so they can provide a wider set of extra features ([#6473](https://github.com/facebook/elric/pull/6473))
- `[elric-snapshot]` `babel-traverse` is now passed to `elric-snapshot` explicitly to avoid unnecessary requires in every test

### Fixes

- `[elric-haste-map]` Optimize watchman crawler by using `glob` on initial query ([#6689](https://github.com/facebook/elric/pull/6689))
- `[pretty-format]` Fix formatting of invalid Date objects ([#6635](https://github.com/facebook/elric/pull/6635))

## 23.4.0

### Features

- `[elric-haste-map]` Add `computeDependencies` flag to avoid opening files if not needed ([#6667](https://github.com/facebook/elric/pull/6667))
- `[elric-runtime]` Support `require.resolve.paths` ([#6471](https://github.com/facebook/elric/pull/6471))
- `[elric-runtime]` Support `paths` option for `require.resolve` ([#6471](https://github.com/facebook/elric/pull/6471))

### Fixes

- `[elric-runner]` Force parallel runs for watch mode, to avoid TTY freeze ([#6647](https://github.com/facebook/elric/pull/6647))
- `[elric-cli]` properly reprint resolver errors in watch mode ([#6407](https://github.com/facebook/elric/pull/6407))
- `[elric-cli]` Write configuration to stdout when the option was explicitly passed to elric ([#6447](https://github.com/facebook/elric/pull/6447))
- `[elric-cli]` Fix regression on non-matching suites ([6657](https://github.com/facebook/elric/pull/6657))
- `[elric-runtime]` Roll back `micromatch` version to prevent regression when matching files ([#6661](https://github.com/facebook/elric/pull/6661))

## 23.3.0

### Features

- `[elric-cli]` Allow watch plugin to be configured ([#6603](https://github.com/facebook/elric/pull/6603))
- `[elric-snapshot]` Introduce `toMatchInlineSnapshot` and `toThrowErrorMatchingInlineSnapshot` matchers ([#6380](https://github.com/facebook/elric/pull/6380))

### Fixes

- `[elric-regex-util]` Improve handling already escaped path separators on Windows ([#6523](https://github.com/facebook/elric/pull/6523))
- `[elric-cli]` Fix `testNamePattern` value with interactive snapshots ([#6579](https://github.com/facebook/elric/pull/6579))
- `[elric-cli]` Fix enter to interrupt watch mode ([#6601](https://github.com/facebook/elric/pull/6601))

### Chore & Maintenance

- `[website]` Switch domain to https://elricjs.io ([#6549](https://github.com/facebook/elric/pull/6549))
- `[tests]` Improve stability of `yarn test` on Windows ([#6534](https://github.com/facebook/elric/pull/6534))
- `[*]` Transpile object shorthand into Node 4 compatible syntax ([#6582](https://github.com/facebook/elric/pull/6582))
- `[*]` Update all legacy links to elricjs.io ([#6622](https://github.com/facebook/elric/pull/6622))
- `[docs]` Add docs for 23.1, 23.2, and 23.3 ([#6623](https://github.com/facebook/elric/pull/6623))
- `[website]` Only test/deploy website if relevant files are changed ([#6626](https://github.com/facebook/elric/pull/6626))
- `[docs]` Describe behavior of `resetModules` option when set to `false` ([#6641](https://github.com/facebook/elric/pull/6641))

## 23.2.0

### Features

- `[elric-each]` Add support for keyPaths in test titles ([#6457](https://github.com/facebook/elric/pull/6457))
- `[elric-cli]` Add `elric --init` option that generates a basic configuration file with a short description for each option ([#6442](https://github.com/facebook/elric/pull/6442))
- `[elric.retryTimes]` Add `elric.retryTimes()` option that allows failed tests to be retried n-times when using elric-circus. ([#6498](https://github.com/facebook/elric/pull/6498))

### Fixes

- `[docs]` Fixed error in documentation for expect.not.arrayContaining(array). ([#6491](https://github.com/facebook/elric/pull/6491))
- `[elric-cli]` Add check to make sure one or more tests have run before notifying when using `--notify` ([#6495](https://github.com/facebook/elric/pull/6495))
- `[elric-cli]` Pass `globalConfig` as a parameter to `globalSetup` and `globalTeardown` functions ([#6486](https://github.com/facebook/elric/pull/6486))
- `[elric-config]` Add missing options to the `defaults` object ([#6428](https://github.com/facebook/elric/pull/6428))
- `[expect]` Using symbolic property names in arrays no longer causes the `toEqual` matcher to fail ([#6391](https://github.com/facebook/elric/pull/6391))
- `[expect]` `toEqual` no longer tries to compare non-enumerable symbolic properties, to be consistent with non-symbolic properties. ([#6398](https://github.com/facebook/elric/pull/6398))
- `[elric-util]` `console.timeEnd` now properly log elapsed time in milliseconds. ([#6456](https://github.com/facebook/elric/pull/6456))
- `[elric-mock]` Fix `MockNativeMethods` access in react-native `elric.mock()` ([#6505](https://github.com/facebook/elric/pull/6505))
- `[elric-cli]` Fix `reporters` for `moduleName` = `'default'` ([#6542](https://github.com/facebook/elric/pull/6542))

### Chore & Maintenance

- `[docs]` Add elric-each docs for 1 dimensional arrays ([#6444](https://github.com/facebook/elric/pull/6444/files))

## 23.1.0

### Features

- `[elric-each]` Add pretty-format serialising to each titles ([#6357](https://github.com/facebook/elric/pull/6357))
- `[elric-cli]` shouldRunTestSuite watch hook now receives an object with `config`, `testPath` and `duration` ([#6350](https://github.com/facebook/elric/pull/6350))
- `[elric-each]` Support one dimensional array of data ([#6351](https://github.com/facebook/elric/pull/6351))
- `[elric-watch]` create new package `elric-watch` to ease custom watch plugin development ([#6318](https://github.com/facebook/elric/pull/6318))
- `[elric-circus]` Make hooks in empty describe blocks error ([#6320](https://github.com/facebook/elric/pull/6320))
- Add a config/CLI option `errorOnDeprecated` which makes calling deprecated APIs throw hepful error messages ([#6339](https://github.com/facebook/elric/pull/6339))

### Fixes

- `[elric-each]` Fix pluralising missing arguments error ([#6369](https://github.com/facebook/elric/pull/6369))
- `[elric-each]` Stop test title concatenating extra args ([#6346](https://github.com/facebook/elric/pull/6346))
- `[expect]` toHaveBeenNthCalledWith/nthCalledWith gives wrong call messages if not matched ([#6340](https://github.com/facebook/elric/pull/6340))
- `[elric-each]` Make sure invalid arguments to `each` points back to the user's code ([#6347](https://github.com/facebook/elric/pull/6347))
- `[expect]` toMatchObject throws TypeError when a source property is null ([#6313](https://github.com/facebook/elric/pull/6313))
- `[elric-cli]` Normalize slashes in paths in CLI output on Windows ([#6310](https://github.com/facebook/elric/pull/6310))
- `[elric-cli]` Fix run beforeAll in excluded suites tests" mode. ([#6234](https://github.com/facebook/elric/pull/6234))
- `[elric-haste-map`] Compute SHA-1s for non-tracked files when using Node crawler ([#6264](https://github.com/facebook/elric/pull/6264))

### Chore & Maintenance

- `[docs]` Improve documentation of `mockClear`, `mockReset`, and `mockRestore` ([#6227](https://github.com/facebook/elric/pull/6227/files))
- `[elric-each]` Refactor each to use shared implementation with core ([#6345](https://github.com/facebook/elric/pull/6345))
- `[elric-each]` Update elric-each docs for serialising values into titles ([#6337](https://github.com/facebook/elric/pull/6337))
- `[elric-circus]` Add dependency on elric-each ([#6309](https://github.com/facebook/elric/pull/6309))
- `[filenames]` Rename "integration-tests" to "e2e" ([#6315](https://github.com/facebook/elric/pull/6315))
- `[docs]` Mention the use of commit hash with `--changedSince` flag ([#6330](https://github.com/facebook/elric/pull/6330))

## 23.0.1

### Chore & Maintenance

- `[elric-jasemine2]` Add dependency on elric-each ([#6308](https://github.com/facebook/elric/pull/6308))
- `[elric-each]` Move elric-each into core elric ([#6278](https://github.com/facebook/elric/pull/6278))
- `[examples]` Update typescript example to using ts-elric ([#6260](https://github.com/facebook/elric/pull/6260))

### Fixes

- `[pretty-format]` Serialize inverse asymmetric matchers correctly ([#6272](https://github.com/facebook/elric/pull/6272))

## 23.0.0

### Features

- `[expect]` Expose `getObjectSubset`, `iterableEquality`, and `subsetEquality` ([#6210](https://github.com/facebook/elric/pull/6210))
- `[elric-snapshot]` Add snapshot property matchers ([#6210](https://github.com/facebook/elric/pull/6210))
- `[elric-config]` Support elric-preset.js files within Node modules ([#6185](https://github.com/facebook/elric/pull/6185))
- `[elric-cli]` Add `--detectOpenHandles` flag which enables elric to potentially track down handles keeping it open after tests are complete. ([#6130](https://github.com/facebook/elric/pull/6130))
- `[elric-jasmine2]` Add data driven testing based on `elric-each` ([#6102](https://github.com/facebook/elric/pull/6102))
- `[elric-matcher-utils]` Change "suggest to equal" message to be more advisory ([#6103](https://github.com/facebook/elric/issues/6103))
- `[elric-message-util]` Don't ignore messages with `vendor` anymore ([#6117](https://github.com/facebook/elric/pull/6117))
- `[elric-validate]` Get rid of `elric-config` dependency ([#6067](https://github.com/facebook/elric/pull/6067))
- `[elric-validate]` Adds option to inject `deprecationEntries` ([#6067](https://github.com/facebook/elric/pull/6067))
- `[elric-snapshot]` [**BREAKING**] Concatenate name of test, optional snapshot name and count ([#6015](https://github.com/facebook/elric/pull/6015))
- `[elric-runtime]` Allow for transform plugins to skip the definition process method if createTransformer method was defined. ([#5999](https://github.com/facebook/elric/pull/5999))
- `[expect]` Add stack trace for async errors ([#6008](https://github.com/facebook/elric/pull/6008))
- `[elric-jasmine2]` Add stack trace for timeouts ([#6008](https://github.com/facebook/elric/pull/6008))
- `[elric-jasmine2]` Add stack trace for thrown non-`Error`s ([#6008](https://github.com/facebook/elric/pull/6008))
- `[elric-runtime]` Prevent modules from marking themselves as their own parent ([#5235](https://github.com/facebook/elric/issues/5235))
- `[elric-mock]` Add support for auto-mocking generator functions ([#5983](https://github.com/facebook/elric/pull/5983))
- `[expect]` Add support for async matchers ([#5919](https://github.com/facebook/elric/pull/5919))
- `[expect]` Suggest toContainEqual ([#5948](https://github.com/facebook/elric/pull/5953))
- `[elric-config]` Export elric's default options ([#5948](https://github.com/facebook/elric/pull/5948))
- `[elric-editor-support]` Move `coverage` to `ProjectWorkspace.collectCoverage` ([#5929](https://github.com/facebook/elric/pull/5929))
- `[elric-editor-support]` Add `coverage` option to runner ([#5836](https://github.com/facebook/elric/pull/5836))
- `[elric-haste-map]` Support extracting dynamic `import`s ([#5883](https://github.com/facebook/elric/pull/5883))
- `[expect]` Improve output format for mismatchedArgs in mock/spy calls. ([#5846](https://github.com/facebook/elric/pull/5846))
- `[elric-cli]` Add support for using `--coverage` in combination with watch mode, `--onlyChanged`, `--findRelatedTests` and more ([#5601](https://github.com/facebook/elric/pull/5601))
- `[elric-jasmine2]` [**BREAKING**] Adds error throwing and descriptive errors to `it`/ `test` for invalid arguments. `[elric-circus]` Adds error throwing and descriptive errors to `it`/ `test` for invalid arguments ([#5558](https://github.com/facebook/elric/pull/5558))
- `[elric-matcher-utils]` Add `isNot` option to `matcherHint` function ([#5512](https://github.com/facebook/elric/pull/5512))
- `[elric-config]` Add `<rootDir>` to runtime files not found error report ([#5693](https://github.com/facebook/elric/pull/5693))
- `[expect]` Make toThrow matcher pass only if Error object is returned from promises ([#5670](https://github.com/facebook/elric/pull/5670))
- `[expect]` Add isError to utils ([#5670](https://github.com/facebook/elric/pull/5670))
- `[expect]` Add inverse matchers (`expect.not.arrayContaining`, etc., [#5517](https://github.com/facebook/elric/pull/5517))
- `[expect]` `expect.extend` now also extends asymmetric matchers ([#5503](https://github.com/facebook/elric/pull/5503))
- `[elric-mock]` Update `spyOnProperty` to support spying on the prototype chain ([#5753](https://github.com/facebook/elric/pull/5753))
- `[elric-mock]` Add tracking of return values in the `mock` property ([#5752](https://github.com/facebook/elric/pull/5752))
- `[elric-mock]` Add tracking of thrown errors in the `mock` property ([#5764](https://github.com/facebook/elric/pull/5764))
- `[expect]`Add nthCalledWith spy matcher ([#5605](https://github.com/facebook/elric/pull/5605))
- `[elric-cli]` Add `isSerial` property that runners can expose to specify that they can not run in parallel ([#5706](https://github.com/facebook/elric/pull/5706))
- `[expect]` Add `.toBeCalledTimes` and `toHaveBeenNthCalledWith` aliases ([#5826](https://github.com/facebook/elric/pull/5826))
- `[elric-cli]` Interactive Snapshot Mode improvements ([#5864](https://github.com/facebook/elric/pull/5864))
- `[elric-editor-support]` Add `no-color` option to runner ([#5909](https://github.com/facebook/elric/pull/5909))
- `[elric-jasmine2]` Pretty-print non-Error object errors ([#5980](https://github.com/facebook/elric/pull/5980))
- `[elric-message-util]` Include column in stack frames ([#5889](https://github.com/facebook/elric/pull/5889))
- `[expect]` Introduce toStrictEqual ([#6032](https://github.com/facebook/elric/pull/6032))
- `[expect]` Add return matchers ([#5879](https://github.com/facebook/elric/pull/5879))
- `[elric-cli]` Improve snapshot summaries ([#6181](https://github.com/facebook/elric/pull/6181))
- `[expect]` Include custom mock names in error messages ([#6199](https://github.com/facebook/elric/pull/6199))
- `[elric-diff]` Support returning diff from oneline strings ([#6221](https://github.com/facebook/elric/pull/6221))
- `[expect]` Improve return matchers ([#6172](https://github.com/facebook/elric/pull/6172))
- `[elric-cli]` Overhaul watch plugin hooks names ([#6249](https://github.com/facebook/elric/pull/6249))
- `[elric-mock]` [**BREAKING**] Include tracked call results in serialized mock ([#6244](https://github.com/facebook/elric/pull/6244))

### Fixes

- `[elric-cli]` Fix stdin encoding to utf8 for watch plugins. ([#6253](https://github.com/facebook/elric/issues/6253))
- `[expect]` Better detection of DOM Nodes for equality ([#6246](https://github.com/facebook/elric/pull/6246))
- `[elric-cli]` Fix misleading action description for F key when in "only failed tests" mode. ([#6167](https://github.com/facebook/elric/issues/6167))
- `[elric-worker]` Stick calls to workers before processing them ([#6073](https://github.com/facebook/elric/pull/6073))
- `[babel-plugin-elric-hoist]` Allow using `console` global variable ([#6075](https://github.com/facebook/elric/pull/6075))
- `[elric-jasmine2]` Always remove node core message from assert stack traces ([#6055](https://github.com/facebook/elric/pull/6055))
- `[expect]` Add stack trace when `expect.assertions` and `expect.hasAssertions` causes test failures. ([#5997](https://github.com/facebook/elric/pull/5997))
- `[elric-runtime]` Throw a more useful error when trying to require modules after the test environment is torn down ([#5888](https://github.com/facebook/elric/pull/5888))
- `[elric-mock]` [**BREAKING**] Replace timestamps with `invocationCallOrder` ([#5867](https://github.com/facebook/elric/pull/5867))
- `[elric-jasmine2]` Install `sourcemap-support` into normal runtime to catch runtime errors ([#5945](https://github.com/facebook/elric/pull/5945))
- `[elric-jasmine2]` Added assertion error handling inside `afterAll hook` ([#5884](https://github.com/facebook/elric/pull/5884))
- `[elric-cli]` Remove the notifier actions in case of failure when not in watch mode. ([#5861](https://github.com/facebook/elric/pull/5861))
- `[elric-mock]` Extend .toHaveBeenCalled return message with outcome ([#5951](https://github.com/facebook/elric/pull/5951))
- `[elric-runner]` Assign `process.env.elric_WORKER_ID="1"` when in runInBand mode ([#5860](https://github.com/facebook/elric/pull/5860))
- `[elric-cli]` Add descriptive error message when trying to use `globalSetup`/`globalTeardown` file that doesn't export a function. ([#5835](https://github.com/facebook/elric/pull/5835))
- `[expect]` Do not rely on `instanceof RegExp`, since it will not work for RegExps created inside of a different VM ([#5729](https://github.com/facebook/elric/pull/5729))
- `[elric-resolve]` Update node module resolution algorithm to correctly handle symlinked paths ([#5085](https://github.com/facebook/elric/pull/5085))
- `[elric-editor-support]` Update `Settings` to use spawn in shell option ([#5658](https://github.com/facebook/elric/pull/5658))
- `[elric-cli]` Improve the error message when 2 projects resolve to the same config ([#5674](https://github.com/facebook/elric/pull/5674))
- `[elric-runtime]` remove retainLines from coverage instrumentation ([#5692](https://github.com/facebook/elric/pull/5692))
- `[elric-cli]` Fix update snapshot issue when using watchAll ([#5696](https://github.com/facebook/elric/pull/5696))
- `[expect]` Fix rejects.not matcher ([#5670](https://github.com/facebook/elric/pull/5670))
- `[elric-runtime]` Prevent Babel warnings on large files ([#5702](https://github.com/facebook/elric/pull/5702))
- `[elric-mock]` Prevent `mockRejectedValue` from causing unhandled rejection ([#5720](https://github.com/facebook/elric/pull/5720))
- `[pretty-format]` Handle React fragments better ([#5816](https://github.com/facebook/elric/pull/5816))
- `[pretty-format]` Handle formatting of `React.forwardRef` and `Context` components ([#6093](https://github.com/facebook/elric/pull/6093))
- `[elric-cli]` Switch collectCoverageFrom back to a string ([#5914](https://github.com/facebook/elric/pull/5914))
- `[elric-regex-util]` Fix handling regex symbols in tests path on Windows ([#5941](https://github.com/facebook/elric/pull/5941))
- `[elric-util]` Fix handling of NaN/Infinity in mock timer delay ([#5966](https://github.com/facebook/elric/pull/5966))
- `[elric-resolve]` Generalise test for package main entries equivalent to ".". ([#5968](https://github.com/facebook/elric/pull/5968))
- `[elric-config]` Ensure that custom resolvers are used when resolving the configuration ([#5976](https://github.com/facebook/elric/pull/5976))
- `[website]` Fix website docs ([#5853](https://github.com/facebook/elric/pull/5853))
- `[expect]` Fix isEqual Set and Map to compare object values and keys regardless of order ([#6150](https://github.com/facebook/elric/pull/6150))
- `[pretty-format]` [**BREAKING**] Remove undefined props from React elements ([#6162](https://github.com/facebook/elric/pull/6162))
- `[elric-haste-map]` Properly resolve mocked node modules without package.json defined ([#6232](https://github.com/facebook/elric/pull/6232))

### Chore & Maintenance

- `[elric-runner]` Move sourcemap installation from `elric-jasmine2` to `elric-runner` ([#6176](https://github.com/facebook/elric/pull/6176))
- `[elric-cli]` Use yargs's built-in `version` instead of rolling our own ([#6215](https://github.com/facebook/elric/pull/6215))
- `[docs]` Add explanation on how to mock methods not implemented in JSDOM
- `[elric-jasmine2]` Simplify `Env.execute` and TreeProcessor to setup and clean resources for the top suite the same way as for all of the children suites ([#5885](https://github.com/facebook/elric/pull/5885))
- `[babel-elric]` [**BREAKING**] Always return object from transformer ([#5991](https://github.com/facebook/elric/pull/5991))
- `[*]` Run Prettier on compiled output ([#5858](https://github.com/facebook/elric/pull/3497))
- `[elric-cli]` Add fileChange hook for plugins ([#5708](https://github.com/facebook/elric/pull/5708))
- `[docs]` Add docs on using `elric.mock(...)` ([#5648](https://github.com/facebook/elric/pull/5648))
- `[docs]` Mention elric Puppeteer Preset ([#5722](https://github.com/facebook/elric/pull/5722))
- `[docs]` Add elric-community section to website ([#5675](https://github.com/facebook/elric/pull/5675))
- `[docs]` Add versioned docs for v22.4 ([#5733](https://github.com/facebook/elric/pull/5733))
- `[docs]` Improve Snapshot Testing Guide ([#5812](https://github.com/facebook/elric/issues/5812))
- `[elric-runtime]` [**BREAKING**] Remove `elric.genMockFn` and `elric.genMockFunction` ([#6173](https://github.com/facebook/elric/pull/6173))
- `[elric-message-util]` Avoid adding unnecessary indent to blank lines in stack traces ([#6211](https://github.com/facebook/elric/pull/6211))

## 22.4.2

### Fixes

- `[elric-haste-map]` Recreate Haste map when deserialization fails ([#5642](https://github.com/facebook/elric/pull/5642))

## 22.4.1

### Fixes

- `[elric-haste-map]` Parallelize Watchman calls in crawler ([#5640](https://github.com/facebook/elric/pull/5640))
- `[elric-editor-support]` Update TypeScript definitions ([#5625](https://github.com/facebook/elric/pull/5625))
- `[babel-elric]` Remove `retainLines` argument to babel. ([#5594](https://github.com/facebook/elric/pull/5594))

### Features

- `[elric-runtime]` Provide `require.main` property set to module with test suite ([#5618](https://github.com/facebook/elric/pull/5618))

### Chore & Maintenance

- `[docs]` Add note about Node version support ([#5622](https://github.com/facebook/elric/pull/5622))
- `[docs]` Update to use yarn ([#5624](https://github.com/facebook/elric/pull/5624))
- `[docs]` Add how to mock scoped modules to Manual Mocks doc ([#5638](https://github.com/facebook/elric/pull/5638))

## 22.4.0

### Fixes

- `[elric-haste-map]` Overhauls how Watchman crawler works fixing Windows ([#5615](https://github.com/facebook/elric/pull/5615))
- `[expect]` Allow matching of Errors against plain objects ([#5611](https://github.com/facebook/elric/pull/5611))
- `[elric-haste-map]` Do not read binary files in Haste, even when instructed to do so ([#5612](https://github.com/facebook/elric/pull/5612))
- `[elric-cli]` Don't skip matchers for exact files ([#5582](https://github.com/facebook/elric/pull/5582))
- `[docs]` Update discord links ([#5586](https://github.com/facebook/elric/pull/5586))
- `[elric-runtime]` Align handling of testRegex on Windows between searching for tests and instrumentation checks ([#5560](https://github.com/facebook/elric/pull/5560))
- `[elric-config]` Make it possible to merge `transform` option with preset ([#5505](https://github.com/facebook/elric/pull/5505))
- `[elric-util]` Fix `console.assert` behavior in custom & buffered consoles ([#5576](https://github.com/facebook/elric/pull/5576))

### Features

- `[docs]` Add MongoDB guide ([#5571](https://github.com/facebook/elric/pull/5571))
- `[elric-runtime]` Deprecate mapCoverage option. ([#5177](https://github.com/facebook/elric/pull/5177))
- `[babel-elric]` Add option to return sourcemap from the transformer separately from source. ([#5177](https://github.com/facebook/elric/pull/5177))
- `[elric-validate]` Add ability to log deprecation warnings for CLI flags. ([#5536](https://github.com/facebook/elric/pull/5536))
- `[elric-serializer]` Added new module for serializing. Works using V8 or JSON ([#5609](https://github.com/facebook/elric/pull/5609))
- `[docs]` Add a documentation note for project `displayName` configuration ([#5600](https://github.com/facebook/elric/pull/5600))

### Chore & Maintenance

- `[docs]` Update automatic mocks documentation ([#5630](https://github.com/facebook/elric/pull/5630))

## elric 22.3.0

### Fixes

- `[expect]` Add descriptive error message to CalledWith methods when missing optional arguments ([#5547](https://github.com/facebook/elric/pull/5547))
- `[elric-cli]` Fix inability to quit watch mode while debugger is still attached ([#5029](https://github.com/facebook/elric/pull/5029))
- `[elric-haste-map]` Properly handle platform-specific file deletions ([#5534](https://github.com/facebook/elric/pull/5534))

### Features

- `[elric-util]` Add the following methods to the "console" implementations: `assert`, `count`, `countReset`, `dir`, `dirxml`, `group`, `groupCollapsed`, `groupEnd`, `time`, `timeEnd` ([#5514](https://github.com/facebook/elric/pull/5514))
- `[docs]` Add documentation for interactive snapshot mode ([#5291](https://github.com/facebook/elric/pull/5291))
- `[elric-editor-support]` Add watchAll flag ([#5523](https://github.com/facebook/elric/pull/5523))
- `[elric-cli]` Support multiple glob patterns for `collectCoverageFrom` ([#5537](https://github.com/facebook/elric/pull/5537))
- `[docs]` Add versioned documentation to the website ([#5541](https://github.com/facebook/elric/pull/5541))

### Chore & Maintenance

- `[elric-config]` Allow `<rootDir>` to be used with `collectCoverageFrom` ([#5524](https://github.com/facebook/elric/pull/5524))
- `[filenames]` Standardize files names in "integration-tests" folder ([#5513](https://github.com/facebook/elric/pull/5513))

## elric 22.2.2

### Fixes

- `[babel-elric]` Revert "Remove retainLines from babel-elric" ([#5496](https://github.com/facebook/elric/pull/5496))
- `[elric-docblock]` Support multiple of the same `@pragma`. ([#5154](https://github.com/facebook/elric/pull/5502))

### Features

- `[elric-worker]` Assign a unique id for each worker and pass it to the child process. It will be available via `process.env.elric_WORKER_ID` ([#5494](https://github.com/facebook/elric/pull/5494))

### Chore & Maintenance

- `[filenames]` Standardize file names in root ([#5500](https://github.com/facebook/elric/pull/5500))

## elric 22.2.1

### Fixes

- `[elric-config]` "all" takes precedence over "lastCommit" ([#5486](https://github.com/facebook/elric/pull/5486))

## elric 22.2.0

### Features

- `[elric-runner]` Move test summary to after coverage report ([#4512](https://github.com/facebook/elric/pull/4512))
- `[elric-cli]` Added `--notifyMode` to specify when to be notified. ([#5125](https://github.com/facebook/elric/pull/5125))
- `[diff-sequences]` New package compares items in two sequences to find a **longest common subsequence**. ([#5407](https://github.com/facebook/elric/pull/5407))
- `[elric-matcher-utils]` Add `comment` option to `matcherHint` function ([#5437](https://github.com/facebook/elric/pull/5437))
- `[elric-config]` Allow lastComit and changedFilesWithAncestor via JSON config ([#5476](https://github.com/facebook/elric/pull/5476))
- `[elric-util]` Add deletion to `process.env` as well ([#5466](https://github.com/facebook/elric/pull/5466))
- `[elric-util]` Add case-insensitive getters/setters to `process.env` ([#5465](https://github.com/facebook/elric/pull/5465))
- `[elric-mock]` Add util methods to create async functions. ([#5318](https://github.com/facebook/elric/pull/5318))

### Fixes

- `[elric-cli]` Add trailing slash when checking root folder ([#5464](https://github.com/facebook/elric/pull/5464))
- `[elric-cli]` Hide interactive mode if there are no failed snapshot tests ([#5450](https://github.com/facebook/elric/pull/5450))
- `[babel-elric]` Remove retainLines from babel-elric ([#5439](https://github.com/facebook/elric/pull/5439))
- `[elric-cli]` Glob patterns ignore non-`require`-able files (e.g. `README.md`) ([#5199](https://github.com/facebook/elric/issues/5199))
- `[elric-mock]` Add backticks support (\`\`) to `mock` a certain package via the `__mocks__` folder. ([#5426](https://github.com/facebook/elric/pull/5426))
- `[elric-message-util]` Prevent an `ENOENT` crash when the test file contained a malformed source-map. ([#5405](https://github.com/facebook/elric/pull/5405)).
- `[elric]` Add `import-local` to `elric` package. ([#5353](https://github.com/facebook/elric/pull/5353))
- `[expect]` Support class instances in `.toHaveProperty()` and `.toMatchObject` matcher. ([#5367](https://github.com/facebook/elric/pull/5367))
- `[elric-cli]` Fix npm update command for snapshot summary. ([#5376](https://github.com/facebook/elric/pull/5376), [5389](https://github.com/facebook/elric/pull/5389/))
- `[expect]` Make `rejects` and `resolves` synchronously validate its argument. ([#5364](https://github.com/facebook/elric/pull/5364))
- `[docs]` Add tutorial page for ES6 class mocks. ([#5383](https://github.com/facebook/elric/pull/5383))
- `[elric-resolve]` Search required modules in node_modules and then in custom paths. ([#5403](https://github.com/facebook/elric/pull/5403))
- `[elric-resolve]` Get builtin modules from node core. ([#5411](https://github.com/facebook/elric/pull/5411))
- `[elric-resolve]` Detect and preserve absolute paths in `moduleDirectories`. Do not generate additional (invalid) paths by prepending each ancestor of `cwd` to the absolute path. Additionally, this fixes functionality in Windows OS. ([#5398](https://github.com/facebook/elric/pull/5398))

### Chore & Maintenance

- `[elric-util]` Implement watch plugins ([#5399](https://github.com/facebook/elric/pull/5399))

## elric 22.1.4

### Fixes

- `[elric-util]` Add "debug" method to "console" implementations ([#5350](https://github.com/facebook/elric/pull/5350))
- `[elric-resolve]` Add condition to avoid infinite loop when node module package main is ".". ([#5344)](https://github.com/facebook/elric/pull/5344))

### Features

- `[elric-cli]` `--changedSince`: allow selectively running tests for code changed since arbitrary revisions. ([#5312](https://github.com/facebook/elric/pull/5312))

## elric 22.1.3

### Fixes

- `[elric-cli]` Check if the file belongs to the checked project before adding it to the list, also checking that the file name is not explicitly blacklisted ([#5341](https://github.com/facebook/elric/pull/5341))
- `[elric-editor-support]` Add option to spawn command in shell ([#5340](https://github.com/facebook/elric/pull/5340))

## elric 22.1.2

### Fixes

- `[elric-cli]` Check if the file belongs to the checked project before adding it to the list ([#5335](https://github.com/facebook/elric/pull/5335))
- `[elric-cli]` Fix `EISDIR` when a directory is passed as an argument to `elric`. ([#5317](https://github.com/facebook/elric/pull/5317))
- `[elric-config]` Added restoreMocks config option. ([#5327](https://github.com/facebook/elric/pull/5327))

## elric 22.1.1

### Fixes

- `[*]` Move from "process.exit" to "exit. ([#5313](https://github.com/facebook/elric/pull/5313))

## elric 22.1.0

### Features

- `[elric-cli]` Make elric exit without an error when no tests are found in the case of `--lastCommit`, `--findRelatedTests`, or `--onlyChanged` options having been passed to the CLI
- `[elric-cli]` Add interactive snapshot mode ([#3831](https://github.com/facebook/elric/pull/3831))

### Fixes

- `[elric-cli]` Use `import-local` to support global elric installations. ([#5304](https://github.com/facebook/elric/pull/5304))
- `[elric-runner]` Fix memory leak in coverage reporting ([#5289](https://github.com/facebook/elric/pull/5289))
- `[docs]` Update mention of the minimal version of node supported ([#4947](https://github.com/facebook/elric/issues/4947))
- `[elric-cli]` Fix missing newline in console message ([#5308](https://github.com/facebook/elric/pull/5308))
- `[elric-cli]` `--lastCommit` and `--changedFilesWithAncestor` now take effect even when `--onlyChanged` is not specified. ([#5307](https://github.com/facebook/elric/pull/5307))

### Chore & Maintenance

- `[filenames]` Standardize folder names under `integration-tests/` ([#5298](https://github.com/facebook/elric/pull/5298))

## elric 22.0.6

### Fixes

- `[elric-jasmine2]` Fix memory leak in snapshot reporting ([#5279](https://github.com/facebook/elric/pull/5279))
- `[elric-config]` Fix breaking change in `--testPathPattern` ([#5269](https://github.com/facebook/elric/pull/5269))
- `[docs]` Document caveat with mocks, Enzyme, snapshots and React 16 ([#5258](https://github.com/facebook/elric/issues/5258))

## elric 22.0.5

### Fixes

- `[elric-leak-detector]` Removed the reference to `weak`. Now, parent projects must install it by hand for the module to work.
- `[expect]` Fail test when the types of `stringContaining` and `stringMatching` matchers do not match. ([#5069](https://github.com/facebook/elric/pull/5069))
- `[elric-cli]` Treat dumb terminals as noninteractive ([#5237](https://github.com/facebook/elric/pull/5237))
- `[elric-cli]` `elric --onlyChanged --changedFilesWithAncestor` now also works with git. ([#5189](https://github.com/facebook/elric/pull/5189))
- `[elric-config]` fix unexpected condition to avoid infinite recursion in Windows platform. ([#5161](https://github.com/facebook/elric/pull/5161))
- `[elric-config]` Escape parentheses and other glob characters in `rootDir` before interpolating with `testMatch`. ([#4838](https://github.com/facebook/elric/issues/4838))
- `[elric-regex-util]` Fix breaking change in `--testPathPattern` ([#5230](https://github.com/facebook/elric/pull/5230))
- `[expect]` Do not override `Error` stack (with `Error.captureStackTrace`) for custom matchers. ([#5162](https://github.com/facebook/elric/pull/5162))
- `[pretty-format]` Pretty format for DOMStringMap and NamedNodeMap ([#5233](https://github.com/facebook/elric/pull/5233))
- `[elric-cli]` Use a better console-clearing string on Windows ([#5251](https://github.com/facebook/elric/pull/5251))

### Features

- `[elric-jasmine]` Allowed classes and functions as `describe` names. ([#5154](https://github.com/facebook/elric/pull/5154))
- `[elric-jasmine2]` Support generator functions as specs. ([#5166](https://github.com/facebook/elric/pull/5166))
- `[elric-jasmine2]` Allow `spyOn` with getters and setters. ([#5107](https://github.com/facebook/elric/pull/5107))
- `[elric-config]` Allow configuration objects inside `projects` array ([#5176](https://github.com/facebook/elric/pull/5176))
- `[expect]` Add support to `.toHaveProperty` matcher to accept the keyPath argument as an array of properties/indices. ([#5220](https://github.com/facebook/elric/pull/5220))
- `[docs]` Add documentation for .toHaveProperty matcher to accept the keyPath argument as an array of properties/indices. ([#5220](https://github.com/facebook/elric/pull/5220))
- `[elric-runner]` test environments are now passed a new `options` parameter. Currently this only has the `console` which is the test console that elric will expose to tests. ([#5223](https://github.com/facebook/elric/issues/5223))
- `[elric-environment-jsdom]` pass the `options.console` to a custom instance of `virtualConsole` so jsdom is using the same console as the test. ([#5223](https://github.com/facebook/elric/issues/5223))

### Chore & Maintenance

- `[docs]` Describe the order of execution of describe and test blocks. ([#5217](https://github.com/facebook/elric/pull/5217), [#5238](https://github.com/facebook/elric/pull/5238))
- `[docs]` Add a note on `moduleNameMapper` ordering. ([#5249](https://github.com/facebook/elric/pull/5249))

## elric 22.0.4

### Fixes

- `[elric-cli]` New line before quitting watch mode. ([#5158](https://github.com/facebook/elric/pull/5158))

### Features

- `[babel-elric]` moduleFileExtensions not passed to babel transformer. ([#5110](https://github.com/facebook/elric/pull/5110))

### Chore & Maintenance

- `[*]` Tweaks to better support Node 4 ([#5142](https://github.com/facebook/elric/pull/5142))

## elric 22.0.2 && 22.0.3

### Chore & Maintenance

- `[*]` Tweaks to better support Node 4 ([#5134](https://github.com/facebook/elric/pull/5134))

## elric 22.0.1

### Fixes

- `[elric-runtime]` fix error for test files providing coverage. ([#5117](https://github.com/facebook/elric/pull/5117))

### Features

- `[elric-config]` Add `forceCoverageMatch` to allow collecting coverage from ignored files. ([#5081](https://github.com/facebook/elric/pull/5081))

## elric 22.0.0

### Fixes

- `[elric-resolve]` Use `module.builtinModules` as `BUILTIN_MODULES` when it exists
- `[elric-worker]` Remove `debug` and `inspect` flags from the arguments sent to the child ([#5068](https://github.com/facebook/elric/pull/5068))
- `[elric-config]` Use all `--testPathPattern` and `<regexForTestFiles>` args in `testPathPattern` ([#5066](https://github.com/facebook/elric/pull/5066))
- `[elric-cli]` Do not support `--watch` inside non-version-controlled environments ([#5060](https://github.com/facebook/elric/pull/5060))
- `[elric-config]` Escape Windows path separator in testPathPattern CLI arguments ([#5054](https://github.com/facebook/elric/pull/5054))
- `[elric-jasmine]` Register sourcemaps as node environment to improve performance with jsdom ([#5045](https://github.com/facebook/elric/pull/5045))
- `[pretty-format]` Do not call toJSON recursively ([#5044](https://github.com/facebook/elric/pull/5044))
- `[pretty-format]` Fix errors when identity-obj-proxy mocks CSS Modules ([#4935](https://github.com/facebook/elric/pull/4935))
- `[babel-elric]` Fix support for namespaced babel version 7 ([#4918](https://github.com/facebook/elric/pull/4918))
- `[expect]` fix .toThrow for promises ([#4884](https://github.com/facebook/elric/pull/4884))
- `[elric-docblock]` pragmas should preserve urls ([#4837](https://github.com/facebook/elric/pull/4629))
- `[elric-cli]` Check if `npm_lifecycle_script` calls elric directly ([#4629](https://github.com/facebook/elric/pull/4629))
- `[elric-cli]` Fix --showConfig to show all configs ([#4494](https://github.com/facebook/elric/pull/4494))
- `[elric-cli]` Throw if `maxWorkers` doesn't have a value ([#4591](https://github.com/facebook/elric/pull/4591))
- `[elric-cli]` Use `fs.realpathSync.native` if available ([#5031](https://github.com/facebook/elric/pull/5031))
- `[elric-config]` Fix `--passWithNoTests` ([#4639](https://github.com/facebook/elric/pull/4639))
- `[elric-config]` Support `rootDir` tag in testEnvironment ([#4579](https://github.com/facebook/elric/pull/4579))
- `[elric-editor-support]` Fix `--showConfig` to support elric 20 and elric 21 ([#4575](https://github.com/facebook/elric/pull/4575))
- `[elric-editor-support]` Fix editor support test for node 4 ([#4640](https://github.com/facebook/elric/pull/4640))
- `[elric-mock]` Support mocking constructor in `mockImplementationOnce` ([#4599](https://github.com/facebook/elric/pull/4599))
- `[elric-runtime]` Fix manual user mocks not working with custom resolver ([#4489](https://github.com/facebook/elric/pull/4489))
- `[elric-util]` Fix `runOnlyPendingTimers` for `setTimeout` inside `setImmediate` ([#4608](https://github.com/facebook/elric/pull/4608))
- `[elric-message-util]` Always remove node internals from stacktraces ([#4695](https://github.com/facebook/elric/pull/4695))
- `[elric-resolve]` changes method of determining builtin modules to include missing builtins ([#4740](https://github.com/facebook/elric/pull/4740))
- `[pretty-format]` Prevent error in pretty-format for window in jsdom test env ([#4750](https://github.com/facebook/elric/pull/4750))
- `[elric-resolve]` Preserve module identity for symlinks ([#4761](https://github.com/facebook/elric/pull/4761))
- `[elric-config]` Include error message for `preset` json ([#4766](https://github.com/facebook/elric/pull/4766))
- `[pretty-format]` Throw `PrettyFormatPluginError` if a plugin halts with an exception ([#4787](https://github.com/facebook/elric/pull/4787))
- `[expect]` Keep the stack trace unchanged when `PrettyFormatPluginError` is thrown by pretty-format ([#4787](https://github.com/facebook/elric/pull/4787))
- `[elric-environment-jsdom]` Fix asynchronous test will fail due to timeout issue. ([#4669](https://github.com/facebook/elric/pull/4669))
- `[elric-cli]` Fix `--onlyChanged` path case sensitivity on Windows platform ([#4730](https://github.com/facebook/elric/pull/4730))
- `[elric-runtime]` Use realpath to match transformers ([#5000](https://github.com/facebook/elric/pull/5000))
- `[expect]` [**BREAKING**] Replace identity equality with Object.is in toBe matcher ([#4917](https://github.com/facebook/elric/pull/4917))

### Features

- `[elric-message-util]` Add codeframe to test assertion failures ([#5087](https://github.com/facebook/elric/pull/5087))
- `[elric-config]` Add Global Setup/Teardown options ([#4716](https://github.com/facebook/elric/pull/4716))
- `[elric-config]` Add `testEnvironmentOptions` to apply to jsdom options or node context. ([#5003](https://github.com/facebook/elric/pull/5003))
- `[elric-jasmine2]` Update Timeout error message to `elric.timeout` and display current timeout value ([#4990](https://github.com/facebook/elric/pull/4990))
- `[elric-runner]` Enable experimental detection of leaked contexts ([#4895](https://github.com/facebook/elric/pull/4895))
- `[elric-cli]` Add combined coverage threshold for directories. ([#4885](https://github.com/facebook/elric/pull/4885))
- `[elric-mock]` Add `timestamps` to mock state. ([#4866](https://github.com/facebook/elric/pull/4866))
- `[eslint-plugin-elric]` Add `prefer-to-have-length` lint rule. ([#4771](https://github.com/facebook/elric/pull/4771))
- `[elric-environment-jsdom]` [**BREAKING**] Upgrade to JSDOM@11 ([#4770](https://github.com/facebook/elric/pull/4770))
- `[elric-environment-*]` [**BREAKING**] Add Async Test Environment APIs, dispose is now teardown ([#4506](https://github.com/facebook/elric/pull/4506))
- `[elric-cli]` Add an option to clear the cache ([#4430](https://github.com/facebook/elric/pull/4430))
- `[babel-plugin-elric-hoist]` Improve error message, that the second argument of `elric.mock` must be an inline function ([#4593](https://github.com/facebook/elric/pull/4593))
- `[elric-snapshot]` [**BREAKING**] Concatenate name of test and snapshot ([#4460](https://github.com/facebook/elric/pull/4460))
- `[elric-cli]` [**BREAKING**] Fail if no tests are found ([#3672](https://github.com/facebook/elric/pull/3672))
- `[elric-diff]` Highlight only last of odd length leading spaces ([#4558](https://github.com/facebook/elric/pull/4558))
- `[elric-docblock]` Add `docblock.print()` ([#4517](https://github.com/facebook/elric/pull/4517))
- `[elric-docblock]` Add `strip` ([#4571](https://github.com/facebook/elric/pull/4571))
- `[elric-docblock]` Preserve leading whitespace in docblock comments ([#4576](https://github.com/facebook/elric/pull/4576))
- `[elric-docblock]` remove leading newlines from `parswWithComments().comments` ([#4610](https://github.com/facebook/elric/pull/4610))
- `[elric-editor-support]` Add Snapshots metadata ([#4570](https://github.com/facebook/elric/pull/4570))
- `[elric-editor-support]` Adds an 'any' to the typedef for `updateFileWithelricStatus` ([#4636](https://github.com/facebook/elric/pull/4636))
- `[elric-editor-support]` Better monorepo support ([#4572](https://github.com/facebook/elric/pull/4572))
- `[elric-environment-jsdom]` Add simple rAF polyfill in jsdom environment to work with React 16 ([#4568](https://github.com/facebook/elric/pull/4568))
- `[elric-environment-node]` Implement node Timer api ([#4622](https://github.com/facebook/elric/pull/4622))
- `[elric-jasmine2]` Add testPath to reporter callbacks ([#4594](https://github.com/facebook/elric/pull/4594))
- `[elric-mock]` Added support for naming mocked functions with `.mockName(value)` and `.mockGetName()` ([#4586](https://github.com/facebook/elric/pull/4586))
- `[elric-runtime]` Add `module.loaded`, and make `module.require` not enumerable ([#4623](https://github.com/facebook/elric/pull/4623))
- `[elric-runtime]` Add `module.parent` ([#4614](https://github.com/facebook/elric/pull/4614))
- `[elric-runtime]` Support sourcemaps in transformers ([#3458](https://github.com/facebook/elric/pull/3458))
- `[elric-snapshot]` [**BREAKING**] Add a serializer for `elric.fn` to allow a snapshot of a elric mock ([#4668](https://github.com/facebook/elric/pull/4668))
- `[elric-worker]` Initial version of parallel worker abstraction, say hello! ([#4497](https://github.com/facebook/elric/pull/4497))
- `[elric-jasmine2]` Add `testLocationInResults` flag to add location information per spec to test results ([#4782](https://github.com/facebook/elric/pull/4782))
- `[elric-environment-jsdom]` Update JSOM to 11.4, which includes built-in support for `requestAnimationFrame` ([#4919](https://github.com/facebook/elric/pull/4919))
- `[elric-cli]` Hide watch usage output when running on non-interactive environments ([#4958](https://github.com/facebook/elric/pull/4958))
- `[elric-snapshot]` Promises support for `toThrowErrorMatchingSnapshot` ([#4946](https://github.com/facebook/elric/pull/4946))
- `[elric-cli]` Explain which snapshots are obsolete ([#5005](https://github.com/facebook/elric/pull/5005))

### Chore & Maintenance

- `[docs]` Add guide of using with puppeteer ([#5093](https://github.com/facebook/elric/pull/5093))
- `[elric-util]` `elric-util` should not depend on `elric-mock` ([#4992](https://github.com/facebook/elric/pull/4992))
- `[*]` [**BREAKING**] Drop support for Node.js version 4 ([#4769](https://github.com/facebook/elric/pull/4769))
- `[docs]` Wrap code comments at 80 characters ([#4781](https://github.com/facebook/elric/pull/4781))
- `[eslint-plugin-elric]` Removed from the elric core repo, and moved to https://github.com/elric-community/eslint-plugin-elric ([#4867](https://github.com/facebook/elric/pull/4867))
- `[babel-elric]` Explicitly bump istanbul to newer versions ([#4616](https://github.com/facebook/elric/pull/4616))
- `[expect]` Upgrade mocha and rollup for browser testing ([#4642](https://github.com/facebook/elric/pull/4642))
- `[docs]` Add info about `coveragePathIgnorePatterns` ([#4602](https://github.com/facebook/elric/pull/4602))
- `[docs]` Add Vuejs series of testing with elric ([#4648](https://github.com/facebook/elric/pull/4648))
- `[docs]` Mention about optional `done` argument in test function ([#4556](https://github.com/facebook/elric/pull/4556))
- `[elric-cli]` Bump node-notifier version ([#4609](https://github.com/facebook/elric/pull/4609))
- `[elric-diff]` Simplify highlight for leading and trailing spaces ([#4553](https://github.com/facebook/elric/pull/4553))
- `[elric-get-type]` Add support for date ([#4621](https://github.com/facebook/elric/pull/4621))
- `[elric-matcher-utils]` Call `chalk.inverse` for trailing spaces ([#4578](https://github.com/facebook/elric/pull/4578))
- `[elric-runtime]` Add `.advanceTimersByTime`; keep `.runTimersToTime()` as an alias.
- `[docs]` Include missing dependency in TestEnvironment sample code
- `[docs]` Add clarification for hook execution order
- `[docs]` Update `expect.anything()` sample code ([#5007](https://github.com/facebook/elric/pull/5007))

## elric 21.2.1

- Fix watchAll not running tests on save ([#4550](https://github.com/facebook/elric/pull/4550))
- Add missing escape sequences to ConvertAnsi plugin ([#4544](https://github.com/facebook/elric/pull/4544))

## elric 21.2.0

- 🃏 Change license from BSD+Patents to MIT.
- Allow eslint-plugin to recognize more disabled tests ([#4533](https://github.com/facebook/elric/pull/4533))
- Add babel-plugin for object spread syntax to babel-preset-elric ([#4519](https://github.com/facebook/elric/pull/4519))
- Display outer element and trailing newline consistently in elric-diff ([#4520](https://github.com/facebook/elric/pull/4520))
- Do not modify stack trace of elricAssertionError ([#4516](https://github.com/facebook/elric/pull/4516))
- Print errors after test structure in verbose mode ([#4504](https://github.com/facebook/elric/pull/4504))
- Fix `--silent --verbose` problem ([#4505](https://github.com/facebook/elric/pull/4505))
- Fix: Reset local state of assertions when using hasAssertions ([#4498](https://github.com/facebook/elric/pull/4498))
- elric-resolve: Prevent default resolver failure when potential resolution directory does not exist ([#4483](https://github.com/facebook/elric/pull/4483))

## elric 21.1.0

- (minor) Use ES module exports ([#4454](https://github.com/facebook/elric/pull/4454))
- Allow chaining mockClear and mockReset ([#4475](https://github.com/facebook/elric/pull/4475))
- Call elric-diff and pretty-format more precisely in toHaveProperty matcher ([#4445](https://github.com/facebook/elric/pull/4445))
- Expose restoreAllMocks to object ([#4463](https://github.com/facebook/elric/pull/4463))
- Fix function name cleaning when making mock fn ([#4464](https://github.com/facebook/elric/pull/4464))
- Fix Map/Set equality checker ([#4404](https://github.com/facebook/elric/pull/4404))
- Make FUNCTION_NAME_RESERVED_PATTERN stateless ([#4466](https://github.com/facebook/elric/pull/4466))

## elric 21.0.2

- Take precedence of NODE_PATH when resolving node_modules directories ([#4453](https://github.com/facebook/elric/pull/4453))
- Fix race condition with --coverage and babel-elric identical file contents edge case ([#4432](https://github.com/facebook/elric/pull/4432))
- Add extra parameter `--runTestsByPath`. ([#4411](https://github.com/facebook/elric/pull/4411))
- Upgrade all outdated deps ([#4425](https://github.com/facebook/elric/pull/4425))

## elric 21.0.1

- Remove obsolete error ([#4417](https://github.com/facebook/elric/pull/4417))

## elric 21.0.0

- Add --changedFilesWithAncestor ([#4070](https://github.com/facebook/elric/pull/4070))
- Add --findRelatedFiles ([#4131](https://github.com/facebook/elric/pull/4131))
- Add --onlyChanged tests ([#3977](https://github.com/facebook/elric/pull/3977))
- Add `contextLines` option to elric-diff ([#4152](https://github.com/facebook/elric/pull/4152))
- Add alternative serialize API for pretty-format plugins ([#4114](https://github.com/facebook/elric/pull/4114))
- Add displayName to MPR ([#4327](https://github.com/facebook/elric/pull/4327))
- Add displayName to TestResult ([#4408](https://github.com/facebook/elric/pull/4408))
- Add es5 build of pretty-format ([#4075](https://github.com/facebook/elric/pull/4075))
- Add extra info to no tests for changed files message ([#4188](https://github.com/facebook/elric/pull/4188))
- Add fake chalk in browser builds in order to support IE10 ([#4367](https://github.com/facebook/elric/pull/4367))
- Add elric.requireActual ([#4260](https://github.com/facebook/elric/pull/4260))
- Add maxWorkers to globalConfig ([#4005](https://github.com/facebook/elric/pull/4005))
- Add skipped tests support for elric-editor-support ([#4346](https://github.com/facebook/elric/pull/4346))
- Add source map support for better debugging experience ([#3738](https://github.com/facebook/elric/pull/3738))
- Add support for Error objects in toMatchObject ([#4339](https://github.com/facebook/elric/pull/4339))
- Add support for Immutable.Record in pretty-format ([#3678](https://github.com/facebook/elric/pull/3678))
- Add tests for extract_requires on export types ([#4080](https://github.com/facebook/elric/pull/4080))
- Add that toMatchObject can match arrays ([#3994](https://github.com/facebook/elric/pull/3994))
- Add watchPathIgnorePatterns to exclude paths to trigger test re-run in watch mode ([#4331](https://github.com/facebook/elric/pull/4331))
- Adding ancestorTitles property to JSON test output ([#4293](https://github.com/facebook/elric/pull/4293))
- Allow custom resolver to be used with[out] moduleNameMapper ([#4174](https://github.com/facebook/elric/pull/4174))
- Avoid parsing `.require(…)` method calls ([#3777](https://github.com/facebook/elric/pull/3777))
- Avoid unnecessary function declarations and call in pretty-format ([#3962](https://github.com/facebook/elric/pull/3962))
- Avoid writing to stdout in default reporter if --json is enabled. Fixes #3941 ([#3945](https://github.com/facebook/elric/pull/3945))
- Better error handling for --config ([#4230](https://github.com/facebook/elric/pull/4230))
- Call consistent pretty-format plugins within elric ([#3800](https://github.com/facebook/elric/pull/3800))
- Change babel-core to peerDependency for compatibility with Babel 7 ([#4162](https://github.com/facebook/elric/pull/4162))
- Change Promise detection code in elric-circus to support non-global Promise implementations ([#4375](https://github.com/facebook/elric/pull/4375))
- Changed files eager loading ([#3979](https://github.com/facebook/elric/pull/3979))
- Check whether we should output to stdout or stderr ([#3953](https://github.com/facebook/elric/pull/3953))
- Clarify what objects toContain and toContainEqual can be used on ([#4307](https://github.com/facebook/elric/pull/4307))
- Clean up resolve() logic. Provide useful names for variables and functions. Test that a directory exists before attempting to resolve files within it. ([#4325](https://github.com/facebook/elric/pull/4325))
- cleanupStackTrace ([#3696](https://github.com/facebook/elric/pull/3696))
- compare objects with Symbol keys ([#3437](https://github.com/facebook/elric/pull/3437))
- Complain if expect is passed multiple arguments ([#4237](https://github.com/facebook/elric/pull/4237))
- Completes nodeCrawl with empty roots ([#3776](https://github.com/facebook/elric/pull/3776))
- Consistent naming of files ([#3798](https://github.com/facebook/elric/pull/3798))
- Convert code base to ESM import ([#3778](https://github.com/facebook/elric/pull/3778))
- Correct summary message for flag --findRelatedTests. ([#4309](https://github.com/facebook/elric/pull/4309))
- Coverage thresholds can be set up for individual files ([#4185](https://github.com/facebook/elric/pull/4185))
- custom reporter error handling ([#4051](https://github.com/facebook/elric/pull/4051))
- Define separate type for pretty-format plugin Options ([#3802](https://github.com/facebook/elric/pull/3802))
- Delete confusing async keyword ([#3679](https://github.com/facebook/elric/pull/3679))
- Delete redundant branch in ReactElement and HTMLElement plugins ([#3731](https://github.com/facebook/elric/pull/3731))
- Don't format node assert errors when there's no 'assert' module ([#4376](https://github.com/facebook/elric/pull/4376))
- Don't print test summary in --silent ([#4106](https://github.com/facebook/elric/pull/4106))
- Don't try to build ghost packages ([#3934](https://github.com/facebook/elric/pull/3934))
- Escape double quotes in attribute values in HTMLElement plugin ([#3797](https://github.com/facebook/elric/pull/3797))
- Explain how to clear the cache ([#4232](https://github.com/facebook/elric/pull/4232))
- Factor out common code for collections in pretty-format ([#4184](https://github.com/facebook/elric/pull/4184))
- Factor out common code for markup in React plugins ([#4171](https://github.com/facebook/elric/pull/4171))
- Feature/internal resolve ([#4315](https://github.com/facebook/elric/pull/4315))
- Fix --logHeapUsage ([#4176](https://github.com/facebook/elric/pull/4176))
- Fix --showConfig to show all project configs ([#4078](https://github.com/facebook/elric/pull/4078))
- Fix --watchAll ([#4254](https://github.com/facebook/elric/pull/4254))
- Fix bug when setTimeout is mocked ([#3769](https://github.com/facebook/elric/pull/3769))
- Fix changedFilesWithAncestor ([#4193](https://github.com/facebook/elric/pull/4193))
- Fix colors for expected/stored snapshot message ([#3702](https://github.com/facebook/elric/pull/3702))
- Fix concurrent test failure ([#4159](https://github.com/facebook/elric/pull/4159))
- Fix for 4286: Compare Maps and Sets by value rather than order ([#4303](https://github.com/facebook/elric/pull/4303))
- fix forceExit ([#4105](https://github.com/facebook/elric/pull/4105))
- Fix grammar in React Native docs ([#3838](https://github.com/facebook/elric/pull/3838))
- Fix inconsistent name of complex values in pretty-format ([#4001](https://github.com/facebook/elric/pull/4001))
- Fix issue mocking bound method ([#3805](https://github.com/facebook/elric/pull/3805))
- Fix elric-circus ([#4290](https://github.com/facebook/elric/pull/4290))
- Fix lint warning in main

  ([#4132](https://github.com/facebook/elric/pull/4132))

- Fix linting ([#3946](https://github.com/facebook/elric/pull/3946))
- fix merge conflict ([#4144](https://github.com/facebook/elric/pull/4144))
- Fix minor typo ([#3729](https://github.com/facebook/elric/pull/3729))
- fix missing console.log messages ([#3895](https://github.com/facebook/elric/pull/3895))
- fix mock return value ([#3933](https://github.com/facebook/elric/pull/3933))
- Fix mocking for modules with folders on windows ([#4238](https://github.com/facebook/elric/pull/4238))
- Fix NODE_PATH resolving for relative paths ([#3616](https://github.com/facebook/elric/pull/3616))
- Fix options.moduleNameMapper override order with preset ([#3565](https://github.com/facebook/elric/pull/3565) ([#3689](https://github.com/facebook/elric/pull/3689))
- Fix React PropTypes warning in tests for Immutable plugin ([#4412](https://github.com/facebook/elric/pull/4412))
- Fix regression in mockReturnValueOnce ([#3857](https://github.com/facebook/elric/pull/3857))
- Fix sample code of mock class constructors ([#4115](https://github.com/facebook/elric/pull/4115))
- Fix setup-test-framework-test ([#3773](https://github.com/facebook/elric/pull/3773))
- fix typescript elric test crash ([#4363](https://github.com/facebook/elric/pull/4363))
- Fix watch mode ([#4084](https://github.com/facebook/elric/pull/4084))
- Fix Watchman on windows ([#4018](https://github.com/facebook/elric/pull/4018))
- Fix(babel): Handle ignored files in babel v7 ([#4393](https://github.com/facebook/elric/pull/4393))
- Fix(babel): Support upcoming beta ([#4403](https://github.com/facebook/elric/pull/4403))
- Fixed object matcher ([#3799](https://github.com/facebook/elric/pull/3799))
- Fixes #3820 use extractExpectedAssertionsErrors in jasmine setup
- Flow upgrade ([#4355](https://github.com/facebook/elric/pull/4355))
- Force message in matchers to always be a function ([#3972](https://github.com/facebook/elric/pull/3972))
- Format `describe` and use `test` instead of `it` alias ([#3792](https://github.com/facebook/elric/pull/3792))
- global_config.js for multi-project runner ([#4023](https://github.com/facebook/elric/pull/4023))
- Handle async errors ([#4016](https://github.com/facebook/elric/pull/4016))
- Hard-fail if hasteImpl is throwing an error during initialization. ([#3812](https://github.com/facebook/elric/pull/3812))
- Ignore import type for extract_requires ([#4079](https://github.com/facebook/elric/pull/4079))
- Ignore indentation of data structures in elric-diff ([#3429](https://github.com/facebook/elric/pull/3429))
- Implement 'elric.requireMock' ([#4292](https://github.com/facebook/elric/pull/4292))
- Improve elric phabricator plugin ([#4195](https://github.com/facebook/elric/pull/4195))
- Improve Seq and remove newline from non-min empty in Immutable plugin ([#4241](https://github.com/facebook/elric/pull/4241))
- Improved the elric reporter with snapshot info per test. ([#3660](https://github.com/facebook/elric/pull/3660))
- Include fullName in formattedAssertion ([#4273](https://github.com/facebook/elric/pull/4273))
- Integrated with Yarn workspaces ([#3906](https://github.com/facebook/elric/pull/3906))
- elric --all ([#4020](https://github.com/facebook/elric/pull/4020))
- elric-circus test failures ([#3770](https://github.com/facebook/elric/pull/3770))
- elric-circus Timeouts ([#3760](https://github.com/facebook/elric/pull/3760))
- elric-haste-map: add test case for broken handling of ignore pattern ([#4047](https://github.com/facebook/elric/pull/4047))
- elric-haste-map: add test+fix for broken platform module support ([#3885](https://github.com/facebook/elric/pull/3885))
- elric-haste-map: deprecate functional ignorePattern and use it in cache key ([#4063](https://github.com/facebook/elric/pull/4063))
- elric-haste-map: mock 'fs' with more idiomatic elric.mock() ([#4046](https://github.com/facebook/elric/pull/4046))
- elric-haste-map: only file IO errors should be silently ignored ([#3816](https://github.com/facebook/elric/pull/3816))
- elric-haste-map: throw when trying to get a duplicated module ([#3976](https://github.com/facebook/elric/pull/3976))
- elric-haste-map: watchman crawler: normalize paths ([#3887](https://github.com/facebook/elric/pull/3887))
- elric-runtime: atomic cache write, and check validity of data ([#4088](https://github.com/facebook/elric/pull/4088))
- Join lines with newline in elric-diff ([#4314](https://github.com/facebook/elric/pull/4314))
- Keep ARGV only in CLI files ([#4012](https://github.com/facebook/elric/pull/4012))
- let transformers adjust cache key based on mapCoverage ([#4187](https://github.com/facebook/elric/pull/4187))
- Lift requires ([#3780](https://github.com/facebook/elric/pull/3780))
- Log stack when reporting errors in elric-runtime ([#3833](https://github.com/facebook/elric/pull/3833))
- Make --listTests return a new line separated list when not using --json ([#4229](https://github.com/facebook/elric/pull/4229))
- Make build script printing small-terminals-friendly ([#3892](https://github.com/facebook/elric/pull/3892))
- Make error messages more explicit for toBeCalledWith assertions ([#3913](https://github.com/facebook/elric/pull/3913))
- Make elric-matcher-utils use ESM exports ([#4342](https://github.com/facebook/elric/pull/4342))
- Make elric-runner a standalone package. ([#4236](https://github.com/facebook/elric/pull/4236))
- Make elric’s Test Runner configurable. ([#4240](https://github.com/facebook/elric/pull/4240))
- Make listTests always print to console.log ([#4391](https://github.com/facebook/elric/pull/4391))
- Make providesModuleNodeModules ignore nested node_modules directories
- Make sure function mocks match original arity ([#4170](https://github.com/facebook/elric/pull/4170))
- Make sure runAllTimers also clears all ticks ([#3915](https://github.com/facebook/elric/pull/3915))
- Make toBe matcher error message more helpful for objects and arrays ([#4277](https://github.com/facebook/elric/pull/4277))
- Make useRealTimers play well with timers: fake ([#3858](https://github.com/facebook/elric/pull/3858))
- Move getType from elric-matcher-utils to separate package ([#3559](https://github.com/facebook/elric/pull/3559))
- Multiroot elric-change-files ([#3969](https://github.com/facebook/elric/pull/3969))
- Output created snapshot when using --ci option ([#3693](https://github.com/facebook/elric/pull/3693))
- Point out you can use matchers in .toMatchObject ([#3796](https://github.com/facebook/elric/pull/3796))
- Prevent babelrc package import failure on relative current path ([#3723](https://github.com/facebook/elric/pull/3723))
- Print RDP details for windows builds ([#4017](https://github.com/facebook/elric/pull/4017))
- Provide better error checking for transformed content ([#3807](https://github.com/facebook/elric/pull/3807))
- Provide printText and printComment in markup.js for HTMLElement plugin ([#4344](https://github.com/facebook/elric/pull/4344))
- Provide regex visualization for testRegex ([#3758](https://github.com/facebook/elric/pull/3758))
- Refactor CLI ([#3862](https://github.com/facebook/elric/pull/3862))
- Refactor names and delimiters of complex values in pretty-format ([#3986](https://github.com/facebook/elric/pull/3986))
- Replace concat(Immutable) with Immutable as item of plugins array ([#4207](https://github.com/facebook/elric/pull/4207))
- Replace Jasmine with elric-circus ([#3668](https://github.com/facebook/elric/pull/3668))
- Replace match with test and omit redundant String conversion ([#4311](https://github.com/facebook/elric/pull/4311))
- Replace print with serialize in AsymmetricMatcher plugin ([#4173](https://github.com/facebook/elric/pull/4173))
- Replace print with serialize in ConvertAnsi plugin ([#4225](https://github.com/facebook/elric/pull/4225))
- Replace print with serialize in HTMLElement plugin ([#4215](https://github.com/facebook/elric/pull/4215))
- Replace print with serialize in Immutable plugins ([#4189](https://github.com/facebook/elric/pull/4189))
- Replace unchanging args with one config arg within pretty-format ([#4076](https://github.com/facebook/elric/pull/4076))
- Return UNDEFINED for undefined type in ReactElement plugin ([#4360](https://github.com/facebook/elric/pull/4360))
- Rewrite some read bumps in pretty-format ([#4093](https://github.com/facebook/elric/pull/4093))
- Run update method before installing JRE on Circle ([#4318](https://github.com/facebook/elric/pull/4318))
- Separated the snapshot summary creation from the printing to improve testability. ([#4373](https://github.com/facebook/elric/pull/4373))
- Set coverageDirectory during normalize phase ([#3966](https://github.com/facebook/elric/pull/3966))
- Setup custom reporters after default reporters ([#4053](https://github.com/facebook/elric/pull/4053))
- Setup for Circle 2 ([#4149](https://github.com/facebook/elric/pull/4149))
- Simplify readme ([#3790](https://github.com/facebook/elric/pull/3790))
- Simplify snapshots definition ([#3791](https://github.com/facebook/elric/pull/3791))
- skipNodeResolution config option ([#3987](https://github.com/facebook/elric/pull/3987))
- Small fixes to toHaveProperty docs ([#3878](https://github.com/facebook/elric/pull/3878))
- Sort attributes by name in HTMLElement plugin ([#3783](https://github.com/facebook/elric/pull/3783))
- Specify watchPathIgnorePatterns will only be available in elric 21+ ([#4398](https://github.com/facebook/elric/pull/4398))
- Split TestRunner off of TestScheduler ([#4233](https://github.com/facebook/elric/pull/4233))
- Strict and explicit config resolution logic ([#4122](https://github.com/facebook/elric/pull/4122))
- Support maxDepth option in React plugins ([#4208](https://github.com/facebook/elric/pull/4208))
- Support SVG elements in HTMLElement plugin ([#4335](https://github.com/facebook/elric/pull/4335))
- Test empty Immutable collections with {min: false} option ([#4121](https://github.com/facebook/elric/pull/4121))
- test to debug travis failure in main ([#4145](https://github.com/facebook/elric/pull/4145))
- testPathPattern message test ([#4006](https://github.com/facebook/elric/pull/4006))
- Throw Error When Using Nested It Specs ([#4039](https://github.com/facebook/elric/pull/4039))
- Throw when moduleNameMapper points to inexistent module ([#3567](https://github.com/facebook/elric/pull/3567))
- Unified 'no tests found' message for non-verbose MPR ([#4354](https://github.com/facebook/elric/pull/4354))
- Update migration guide with elric-codemods transformers ([#4306](https://github.com/facebook/elric/pull/4306))
- Use "inputSourceMap" for coverage re-mapping. ([#4009](https://github.com/facebook/elric/pull/4009))
- Use "verbose" no test found message when there is only one project ([#4378](https://github.com/facebook/elric/pull/4378))
- Use babel transform to inline all requires ([#4340](https://github.com/facebook/elric/pull/4340))
- Use eslint plugins to run prettier ([#3971](https://github.com/facebook/elric/pull/3971))
- Use iterableEquality in spy matchers ([#3651](https://github.com/facebook/elric/pull/3651))
- Use modern HTML5 <!DOCTYPE> ([#3937](https://github.com/facebook/elric/pull/3937))
- Wrap `Error.captureStackTrace` in a try ([#4035](https://github.com/facebook/elric/pull/4035))

## elric 20.0.4

- Fix elric-haste-map's handling of duplicate module IDs. ([#3647](https://github.com/facebook/elric/pull/3647))
- Fix behavior of `enableAutomock()` when automock is set to false. ([#3624](https://github.com/facebook/elric/pull/3624))
- Fix progress bar in windows. ([#3626](https://github.com/facebook/elric/pull/3626))

## elric 20.0.3

- Fix reporters 'default' setting. ([#3562](https://github.com/facebook/elric/pull/3562))
- Fix to make elric fail when the coverage threshold not met. ([#3554](https://github.com/facebook/elric/pull/3554))

## elric 20.0.1

- Add ansi-regex to pretty-format dependencies ([#3498](https://github.com/facebook/elric/pull/3498))
- Fix <rootDir> replacement in testMatch and moduleDirectories ([#3538](https://github.com/facebook/elric/pull/3538))
- Fix expect.hasAssertions() to throw when passed arguments ([#3526](https://github.com/facebook/elric/pull/3526))
- Fix stack traces without proper error messages ([#3513](https://github.com/facebook/elric/pull/3513))
- Fix support for custom extensions through haste packages ([#3537](https://github.com/facebook/elric/pull/3537))
- Fix test contexts between test functions ([#3506](https://github.com/facebook/elric/pull/3506))

## elric 20.0.0

- New `--projects` option to run one instance of elric in multiple projects at the same time. ([#3400](https://github.com/facebook/elric/pull/3400))
- New multi project runner ([#3156](https://github.com/facebook/elric/pull/3156))
- New --listTests flag. ([#3441](https://github.com/facebook/elric/pull/3441))
- New --showConfig flag. ([#3296](https://github.com/facebook/elric/pull/3296))
- New promise support for all `expect` matchers through `.resolves` and `.rejects`. ([#3068](https://github.com/facebook/elric/pull/3068))
- New `expect.hasAssertions()` function similar to `expect.assertions()`. ([#3379](https://github.com/facebook/elric/pull/3379))
- New `this.equals` function exposed to custom matchers. ([#3469](https://github.com/facebook/elric/pull/3469))
- New `valid-expect` lint rule in `eslint-plugin-elric`. ([#3067](https://github.com/facebook/elric/pull/3067))
- New HtmlElement pretty-format plugin. ([#3230](https://github.com/facebook/elric/pull/3230))
- New Immutable pretty-format plugins. ([#2899](https://github.com/facebook/elric/pull/2899))
- New test environment per file setting through `@elric-environment` in the docblock. ([#2859](https://github.com/facebook/elric/pull/2859))
- New feature that allows every configuration option to be set from the command line. ([#3424](https://github.com/facebook/elric/pull/3424))
- New feature to add custom reporters to elric through `reporters` in the configuration. ([#3349](https://github.com/facebook/elric/pull/3349))
- New feature to add expected and actual values to AssertionError. ([#3217](https://github.com/facebook/elric/pull/3217))
- New feature to map code coverage from transformers. ([#2290](https://github.com/facebook/elric/pull/2290))
- New feature to run untested code coverage in parallel. ([#3407](https://github.com/facebook/elric/pull/3407))
- New option to define a custom resolver. ([#2998](https://github.com/facebook/elric/pull/2998))
- New printing support for text and comment nodes in html pretty-format. ([#3355](https://github.com/facebook/elric/pull/3355))
- New snapshot testing FAQ ([#3425](https://github.com/facebook/elric/pull/3425))
- New support for custom platforms on elric-haste-map. ([#3162](https://github.com/facebook/elric/pull/3162))
- New support for mocking native async methods. ([#3209](https://github.com/facebook/elric/pull/3209))
- New guide on how to use elric with any JavaScript framework. ([#3243](https://github.com/facebook/elric/pull/3243))
- New translation system for the elric website.
- New collapsing watch mode usage prompt after first run. ([#3078](https://github.com/facebook/elric/pull/3078))
- Breaking Change: Forked Jasmine 2.5 into elric's own test runner and rewrote large parts of Jasmine. ([#3147](https://github.com/facebook/elric/pull/3147))
- Breaking Change: elric does not write new snapshots by default on CI. ([#3456](https://github.com/facebook/elric/pull/3456))
- Breaking Change: Moved the typescript parser from `elric-editor-support` into a separate `elric-test-typescript-parser` package. ([#2973](https://github.com/facebook/elric/pull/2973))
- Breaking Change: Replaced auto-loading of babel-polyfill with only regenerator-runtime, fixes a major memory leak. ([#2755](https://github.com/facebook/elric/pull/2755))
- Fixed `babel-elric` to look up the `babel` field in `package.json` as a fallback.
- Fixed `elric-editor-support`'s parser to not crash on incomplete ASTs. ([#3259](https://github.com/facebook/elric/pull/3259))
- Fixed `elric-resolve` to use `is-builtin-module` instead of `resolve.isCore`. ([#2997](https://github.com/facebook/elric/pull/2997))
- Fixed `elric-snapshot` to normalize line endings in the `serialize` function. ([#3002](https://github.com/facebook/elric/pull/3002))
- Fixed behavior of `--silent` flag. ([#3003](https://github.com/facebook/elric/pull/3003))
- Fixed bug with watchers on macOS causing test to crash. ([#2957](https://github.com/facebook/elric/pull/2957))
- Fixed CLI `notify` option not taking precedence over config option. ([#3340](https://github.com/facebook/elric/pull/3340))
- Fixed detection of the npm client in SummaryReporter to support Yarn. ([#3263](https://github.com/facebook/elric/pull/3263))
- Fixed done.fail not passing arguments ([#3241](https://github.com/facebook/elric/pull/3241))
- Fixed fake timers to restore after resetting mocks. ([#2467](https://github.com/facebook/elric/pull/2467))
- Fixed handling of babylon's parser options in `elric-editor-support`. ([#3344](https://github.com/facebook/elric/pull/3344))
- Fixed elric to properly cache transform results. ([#3334](https://github.com/facebook/elric/pull/3334))
- Fixed elric to use human-readable colors for elric's own snapshots. ([#3119](https://github.com/facebook/elric/pull/3119))
- Fixed elric-config to use UID for default cache folder. ([#3380](https://github.com/facebook/elric/pull/3380)), ([#3387](https://github.com/facebook/elric/pull/3387))
- Fixed elric-runtime to expose inner error when it fails to write to the cache. ([#3373](https://github.com/facebook/elric/pull/3373))
- Fixed lifecycle hooks to make afterAll hooks operate the same as afterEach. ([#3275](https://github.com/facebook/elric/pull/3275))
- Fixed pretty-format to run plugins before serializing nested basic values. ([#3017](https://github.com/facebook/elric/pull/3017))
- Fixed return value of mocks so they can explicitly be set to return `undefined`. ([#3354](https://github.com/facebook/elric/pull/3354))
- Fixed runner to run tests associated with snapshots when the snapshot changes. ([#3025](https://github.com/facebook/elric/pull/3025))
- Fixed snapshot serializer require, restructured pretty-format. ([#3399](https://github.com/facebook/elric/pull/3399))
- Fixed support for Babel 7 in babel-elric. ([#3271](https://github.com/facebook/elric/pull/3271))
- Fixed testMatch to find tests in .folders. ([#3006](https://github.com/facebook/elric/pull/3006))
- Fixed testNamePattern and testPathPattern to work better together. ([#3327](https://github.com/facebook/elric/pull/3327))
- Fixed to show reject reason when expecting resolve. ([#3134](https://github.com/facebook/elric/pull/3134))
- Fixed toHaveProperty() to use hasOwnProperty from Object ([#3410](https://github.com/facebook/elric/pull/3410))
- Fixed watch mode's screen clearing. ([#2959](https://github.com/facebook/elric/pull/2959)) ([#3294](https://github.com/facebook/elric/pull/3294))
- Improved and consolidated elric's configuration file resolution. ([#3472](https://github.com/facebook/elric/pull/3472))
- Improved documentation throughout the elric website.
- Improved documentation to explicitly mention that snapshots must be reviewed. ([#3203](https://github.com/facebook/elric/pull/3203))
- Improved documentation to make it clear CRA users don't need to add dependencies. ([#3312](https://github.com/facebook/elric/pull/3312))
- Improved eslint-plugin-elric's handling of `expect`. ([#3306](https://github.com/facebook/elric/pull/3306))
- Improved flow-coverage, eslint rules and test coverage within the Jest repository.
- Improved printing of `expect.assertions` error. ([#3033](https://github.com/facebook/jest/pull/3033))
- Improved Windows test coverage of Jest.
- Refactored configs & transform ([#3376](https://github.com/facebook/jest/pull/3376))
- Refactored reporters to pass individual Tests to reporters. ([#3289](https://github.com/facebook/jest/pull/3289))
- Refactored TestRunner ([#3166](https://github.com/facebook/jest/pull/3166))
- Refactored watch mode prompts. ([#3290](https://github.com/facebook/jest/pull/3290))
- Deleted `jest-file-exists`. ([#3105](https://github.com/facebook/jest/pull/3105))
- Removed `Config` type. ([#3366](https://github.com/facebook/jest/pull/3366))
- Removed all usage of `jest-file-exists`. ([#3101](https://github.com/facebook/jest/pull/3101))
- Adopted prettier on the Jest codebase.

## jest 19.0.1

- Fix infinite loop when using `--watch` with `--coverage`.
- Fixed `watchman` config option.
- Fixed a bug in the jest-editor-support static analysis.
- Fixed eslint plugin warning.
- Fixed missing space in front of "Did you mean …?".
- Fixed path printing in the reporter on Windows.

## jest 19.0.0

- Breaking Change: Added a version for snapshots.
- Breaking Change: Removed the `mocksPattern` configuration option, it never worked correctly.
- Breaking Change: Renamed `testPathDirs` to `roots` to avoid confusion when configuring Jest.
- Breaking Change: Updated printing of React elements to cause fewer changes when props change.
- Breaking Change: Updated snapshot format to properly escape data.
- Fixed --color to be recognized correctly again.
- Fixed `babel-plugin-jest-hoist` to work properly with type annotations in tests.
- Fixed behavior for console.log calls and fixed a memory leak (#2539).
- Fixed cache directory path for Jest to avoid ENAMETOOLONG errors.
- Fixed change events to be emitted in jest-haste-map's watch mode. This fixes issues with Jest's new watch mode and react-native-packager.
- Fixed cli arguments to be used when loading the config from file, they were previously ignored.
- Fixed Jest to load json files that include a BOM.
- Fixed Jest to throw errors instead of ignoring invalid cli options.
- Fixed mocking behavior for virtual modules.
- Fixed mocking behavior with transitive dependencies.
- Fixed support for asymmetric matchers in `toMatchObject`.
- Fixed test interruption and `--bail` behavior.
- Fixed watch mode to clean up worker processes when a test run gets interrupted.
- Fixed whitespace to be highlighted in snapshots and assertion errors.
- Improved `babel-jest` plugin: babel is loaded lazily, istanbul comments are only added when coverage is used.
- Improved error for invalid transform config.
- Improved moduleNameMapper to not overwrite mocks when many patterns map to the same file.
- Improved printing of skipped tests in verbose mode.
- Improved resolution code in jest-resolve.
- Improved to only show patch marks in assertion errors when the comparison results in large objects.
- New `--collectCoverageFrom` cli argument.
- New `--coverageDirectory` cli argument.
- New `expect.addSnapshotSerializer` to add custom snapshot serializers for tests.
- New `jest.spyOn`.
- New `testMatch` configuration option that accepts glob patterns.
- New eslint-plugin-jest with no-disabled-tests, no-focuses-tests and no-identical-title rules and default configuration and globals.
- New expect.stringContaining asymmetric matcher.
- New feature to make manual mocks with nested folders work. For example `__mocks__/react-native/Library/Text.js` will now work as expected.
- New feature to re-run tests through the notification when using `--notify`.
- New jest-phabricator package to integrate Jest code coverage in phabriactor.
- New jest-validate package to improve configuration errors, help with suggestions of correct configuration and to be adopted in other libraries.
- New pretty-printing for asymmetric matchers.
- New RSS feed for Jest's blog.
- New way to provide a reducer to extract haste module ids.
- New website, new documentation, new color scheme and new homepage.
- Rewritten watch mode for instant feedback, better code quality and to build new features on top of it (#2362).

## jest 18.1.0

- Fixed console.log and fake timer behavior in node 7.3.
- Updated istanbul-api.
- Updated jest-diff equality error message.
- Disabled arrow keys when entering a pattern in watch mode to prevent broken behavior. Will be improved in a future release.
- Moved asymmetric matchers and equality functionality from Jasmine into jest-matchers.
- Removed jasmine and jest-snapshot dependency from jest-matchers.
- Removed unused global `context` variable.
- Show a better error message if the config is invalid JSON.
- Highlight trailing whitespace in assertion diffs and snapshots.
- Jest now uses micromatch instead of minimatch.
- Added `-h` as alias for `--help`.

## jest 18.0.0

See https://jestjs.io/blog/2016/12/15/2016-in-jest

- The testResultsProcessor function is now required to return the modified results.
- Removed `pit` and `mockImpl`. Use `it` or `mockImplementation` instead.
- Fixed re-running tests when `--bail` is used together with `--watch`.
- `pretty-format` is now merged into Jest.
- `require('v8')` now works properly in a test context.
- Jest now clears the entire scrollback in watch mode.
- Added `expect.any`, `expect.anything`, `expect.objectContaining`, `expect.arrayContaining`, `expect.stringMatching`.
- Properly resolve `snapshotSerializers`, `setupFiles`, `transform`, `testRunner` and `testResultsProcessor` instead of using `path.resolve`.
- `--testResultsProcessor` is now exposed through the cli.
- Renamed `--jsonOutputFile` to `--outputFile`.
- Added `jest-editor-support` for vscode and Nuclide integration.
- Fixed `test.concurrent` unhandled promise rejections.
- The Jest website is now auto-deployed when merging into main.
- Updated `testRegex` to include `test.js` and `spec.js` files.
- Fixes for `babel-plugin-jest-hoist` when using `jest.mock` with three arguments.
- The `JSON` global in `jest-environment-node` now comes from the vm context instead of the parent context.
- Jest does not print stack traces from babel any longer.
- Fake timers are reset when `FakeTimers.useTimers()` is called.
- Usage of Jest in watch mode can be hidden through `JEST_HIDE_USAGE`.
- Added `expect.assertions(number)` which will ensure that a specified amount of assertions is made in one test.
- Added `.toMatchSnapshot(?string)` feature to give snapshots a name.
- Escape regex in snapshots.
- `jest-react-native` was deprecated and now forwards `react-native`.
- Added `.toMatchObject` matcher.
- Further improve printing of large objects.
- Fixed `NaN% Failed` in the OS notification when using `--notify`.
- The first test run without cached timings will now use separate processes instead of running in band.
- Added `.toHaveProperty` matcher.
- Fixed `Map`/`Set` comparisons.
- `test.concurrent` now works with `--testNamePattern`.

## jest 17.0.3

- Improved file-watching feature in jest-haste-map.
- Added `.toHaveLength` matcher.
- Improved `.toContain` matcher.

## jest 17.0.2

- Fixed performance regression in module resolution.

## jest 17.0.1

- Fixed pretty printing of big objects.
- Fixed resolution of `.native.js` files in react-native projects.

## jest 17.0.0

- Added `expect.extend`.
- Properly resolve modules with platform extensions on react-native.
- Added support for custom snapshots serializers.
- Updated to Jasmine 2.5.2.
- Big diffs are now collapsed by default in snapshots and assertions. Added `--expand` (or `-e`) to show the full diff.
- Replaced `scriptPreprocessor` with the new `transform` option.
- Added `jest.resetAllMocks` which replaces `jest.clearAllMocks`.
- Fixes for react-native preset.
- Fixes for global built in objects in `jest-environment-node`.
- Create mock objects in the vm context instead of the parent context.
- `.babelrc` is now part of the transform cache key in `babel-jest`.
- Fixes for docblock parsing with haste modules.
- Exit with the proper code when the coverage threshold is not reached.
- Implemented file watching in `jest-haste-map`.
- `--json` now includes information about individual tests inside a file.

## jest 16.0.2

- Symbols are now properly mocked when using `jest-mock`.
- `toHaveBeenCalledWith()` works without arguments again.
- Newlines in snapshots are now normalized across different operating systems.

## jest 16.0.1

- Fix infinite loop.

## jest 16.0.0

- Previously failed tests are now always run first.
- A new concurrent reporter shows currently running tests, a test summary, a progress bar and estimated remaining time if possible.
- Improved CLI colors.
- `jest <pattern>` is now case-insensitive.
- Added `it.only`, `it.skip`, `test.only`, `test.skip` and `xtest`.
- Added `--testNamePattern=pattern` or `-t <pattern>` to run individual tests in test files.
- Jest now warns for duplicate mock files.
- Pressing `a`, `o`, `p`, `q` or `enter` while tests are running in the watch mode, the test run will be interrupted.
- `--bail` now works together with `--watch`.
- Added `test.concurrent` for concurrent async tests.
- Jest now automatically considers files and tests with the `.jsx` extension.
- Added `jest.clearAllMocks` to clear all mocks manually.
- Rewrote Jest's snapshot implementation. `jest-snapshot` can now be more easily integrated into other test runners and used in other projects.
- This requires most snapshots to be updated when upgrading Jest.
- Objects and Arrays in snapshots are now printed with a trailing comma.
- Function names are not printed in snapshots any longer to reduce issues with code coverage instrumentation and different Node versions.
- Snapshots are now sorted using natural sort order.
- Snapshots are not marked as obsolete any longer when using `fit` or when an error is thrown in a test.
- Finished migration of Jasmine matchers to the new Jest matchers.
- Pretty print `toHaveBeenLastCalledWith`, `toHaveBeenCalledWith`, `lastCalledWith` and `toBeCalledWith` failure messages.
- Added `toBeInstanceOf` matcher.
- Added `toContainEqual` matcher.
- Added `toThrowErrorMatchingSnapshot` matcher.
- Improved `moduleNameMapper` resolution.
- Module registry fixes.
- Fixed invocation of the `setupTestFrameworkScriptFile` script to make it easier to use chai together with Jest.
- Removed react-native special case in Jest's configuration.
- Added `--findRelatedTests <fileA> <fileB>` cli option to run tests related to the specified files.
- Added `jest.deepUnmock` to `babel-plugin-jest-hoist`.
- Added `jest.runTimersToTime` which is useful together with fake timers.
- Improved automated mocks for ES modules compiled with babel.

## jest 15.1.1

- Fixed issues with test paths that include hyphens on Windows.
- Fixed `testEnvironment` resolution.
- Updated watch file name pattern input.

## jest 15.1.0

- Pretty printer updates for React and global window objects.
- `jest-runtime` overwrites automocking from configuration files.
- Improvements for watch mode on Windows.
- afterAll/afterEach/beforeAll/beforeEach can now return a Promise and be used together with async/await.
- Improved stack trace printing on Node 4.

## jest 15.0.2

- Fixed Jest with npm2 when using coverage.

## jest 15.0.1

- Updated toThrow and toThrowMatchers and aliased them to the same matcher.
- Improvements for watch mode.
- Fixed Symbol reassignment in tests would break Jest's matchers.
- Fixed `--bail` option.

## jest 15.0.0

- See https://jestjs.io/blog/2016/09/01/jest-15
- Jest by default now also recognizes files ending in `.spec.js` and `.test.js` as test files.
- Completely replaced most Jasmine matchers with new Jest matchers.
- Rewrote Jest's CLI output for test failures and summaries.
- Added `--env` option to override the default test environment.
- Disabled automocking, fake timers and resetting the module registry by default.
- Added `--watchAll`, made `--watch` interactive and added the ability to update snapshots and select test patterns in watch mode.
- Jest uses verbose mode when running a single test file.
- Console messages are now buffered and printed along with the test results.
- Fix `testEnvironment` resolution to prefer `jest-environment-{name}` instead of `{name}` only. This prevents a module colision when using `jsdom` as test environment.
- `moduleNameMapper` now uses a resolution algorithm.
- Improved performance for small test runs.
- Improved API documentation.
- Jest now works properly with directories that have special characters in them.
- Improvements to Jest's own test infra by merging integration and unit tests. Code coverage is now collected for Jest.
- Added `global.global` to the node environment.
- Fixed babel-jest-plugin-hoist issues with functions called `mock`.
- Improved jest-react-native preset with mocks for ListView, TextInput, ActivityIndicator and ScrollView.
- Added `collectCoverageFrom` to collect code coverage from untested files.
- Rewritten code coverage support.

## jest 14.1.0

- Changed Jest's default cache directory.
- Fixed `jest-react-native` for react 15.3.0.
- Updated react and react-native example to use `react-test-renderer`.
- Started to refactor code coverage.

## jest 14.0.2

- `babel-jest` bugfix.

## jest 14.0.1

- `babel-jest` can now be used to compose a transformer.
- Updated snapshot instructions to run `jest -u` or `npm test -- -u`.
- Fixed `config` cli option to enable JSON objects as configuration.
- Updated printing of preset path in the CLI.

## jest 14.0.0

- Official release of snapshot tests.
- Started to replace Jasmine matchers with Jest matchers: `toBe`, `toBeFalsy`, `toBeTruthy`, `toBeNaN`, `toBe{Greater,Less}Than{,OrEqual}`, `toBeNull`, `toBeDefined`, `toBeUndefined`, `toContain`, `toMatch`, `toBeCloseTo` were rewritten.
- Rewrite of Jest's reporters.
- Experimental react-native support.
- Removed Jasmine 1 support from Jest.
- Transform caching improvements.

## jest 13.2.0

- Snapshot bugfixes.
- Timer bugfixes.

## jest 13.1.0

- Added `test` global function as an alias for `it`.
- Added `coveragePathIgnorePatterns` to the config.
- Fixed printing of "JSX objects" in snapshots.
- Fixes for `--verbose` option and top level `it` calls.
- Extended the node environment with more globals.
- testcheck now needs to be required explicitly through `require('jest-check')`.
- Added `jest.deepUnmock`.
- Fail test suite if it does not contain any tests.

## jest 13.0.0

- Added duration of individual tests in verbose mode.
- Added a `browser` config option to properly resolve npm packages with a browser field in `package.json` if you are writing tests for client side apps
- Added `jest-repl`.
- Split up `jest-cli` into `jest-runtime` and `jest-config`.
- Added a notification plugin that shows a test run notification using `--notify`.
- Refactored `TestRunner` into `SearchSource` and improved the "no tests found" message.
- Added `jest.isMockFunction(jest.fn())` to test for mock functions.
- Improved test reporter printing and added a test failure summary when running many tests.
  - Add support for property testing via testcheck-js.
- Added a webpack tutorial.
- Added support for virtual mocks through `jest.mock('Module', implementation, {virtual: true})`.
- Added snapshot functionality through `toMatchSnapshot()`.
- Redesigned website.

## jest-cli 12.1.1

- Windows stability fixes.
- Mock module resolution fixes.
- Remove test files from code coverage.

## jest-cli 12.1.0

- Jest is now also published in the `jest` package on npm.
- Added `testRegex` to match for tests outside of specific folders. Deprecated both `testDirectoryName` and `testFileExtensions`.
- `it` can now return a Promise for async testing. `pit` was deprecated.
- Added `jest-resolve` as a standalone package based on the Facebook module resolution algorithm.
- Added `jest-changed-files` as a standalone package to detect changed files in a git or hg repo.
- Added `--setupTestFrameworkFile` to cli.
- Added support for coverage thresholds. See https://jestjs.io/docs/configuration#coveragethreshold-object.
- Updated to jsdom 9.0.
- Updated and improved stack trace reporting.
- Added `module.filename` and removed the invalid `module.__filename` field.
- Further improved the `lastCalledWith` and `toBeCalledWith` custom matchers. They now print the most recent calls.
- Fixed jest-haste-map on continuous integration systems.
- Fixes for hg/git integration.
- Added a re-try for the watchman crawler.

## jest-cli 12.0.2

- Bug fixes when running a single test file and for scoped package names.

## jest-cli 12.0.1

- Added custom equality matchers for Map/Set and iterables.
- Bug fixes

## jest-cli 12.0.0

- Reimplemented `node-haste` as `jest-haste-map`: https://github.com/facebook/jest/pull/896
- Fixes for the upcoming release of nodejs 6.
- Removed global mock caching which caused negative side-effects on test runs.
- Updated Jasmine from 2.3.4 to 2.4.1.
- Fixed our Jasmine fork to work better with `Object.create(null)`.
- Added a `--silent` flag to silence console messages during a test run.
- Run a test file directly if a path is passed as an argument to Jest.
- Added support for the undocumented nodejs feature `module.paths`.

## jest-cli 11.0.2

- Fixed `jest -o` error when Mercurial isn't installed on the system
- Fixed Jasmine failure message when expected values were mutated after tests.

## jest-cli 11.0.1, babel-jest 11.0.1

- Added support for Mercurial repositories when using `jest -o`
- Added `mockImplementationOnce` API to `jest.fn()`.

## jest-cli 11.0.0, babel-jest 11.0.0 (pre-releases 0.9 to 0.10)

- New implementation of node-haste and rewrite of internal module loading and resolution. Fixed both startup and runtime performance. [#599](https://github.com/facebook/jest/pull/599)
- Jasmine 2 is now the default test runner. To keep using Jasmine 1, put `testRunner: "jasmine1"` into your configuration.
- Added `jest-util`, `jest-mock`, `jest-jasmine1`, `jest-jasmine2`, `jest-environment-node`, `jest-environment-jsdom` packages.
- Added `babel-jest-preset` and `babel-jest` as packages. `babel-jest` is now being auto-detected.
- Added `babel-plugin-jest-hoist` which hoists `jest.unmock`, `jest.mock` and the new `jest.enableAutomock` and `jest.disableAutomock` API.
- Improved `babel-jest` integration and `react-native` testing.
- Improved code coverage reporting when using `babel-jest`.
- Added the `jest.mock('moduleName', moduleFactory)` feature. `jest.mock` now gets hoisted by default. `jest.doMock` was added to explicitly mock a module without the hoisting feature of `babel-jest`.
- Updated jsdom to 8.3.x.
- Improved responsiveness of the system while using `--watch`.
- Clear the terminal window when using `--watch`.
- By default, `--watch` will now only runs tests related to changed files. `--watch=all` can be used to run all tests on file system changes.
- Debounce `--watch` re-runs to not trigger test runs during a branch switch in version control.
- Added `jest.fn()` and `jest.fn(implementation)` as convenient shorcuts for `jest.genMockFunction()` and `jest.genMockFunction().mockImplementation()`.
- Added an `automock` option to turn off automocking globally.
- Added a "no tests found" message if no tests can be found.
- Jest sets `process.NODE_ENV` to `test` unless otherwise specified.
- Fixed `moduleNameMapper` config option when used with paths.
- Fixed an error with Jasmine 2 and tests that `throw 'string errors'`.
- Fixed issues with unmocking symlinked module names.
- Fixed mocking of boolean values.
- Fixed mocking of fields that start with an underscore ("private fields").
- Fixed unmocking behavior with npm3.
- Fixed and improved `--onlyChanged` option.
- Fixed support for running Jest as a git submodule.
- Improved verbose logger output
- Fixed test runtime error reporting and stack traces.
- Improved `toBeCalled` Jasmine 2 custom matcher messages.
- Improved error reporting when a syntax error occurs.
- Renamed HasteModuleLoader to Runtime.
- Jest now properly reports pending tests disabled with `xit` and `xdescribe`.
- Removed `preprocessCachingDisabled` config option.
- Added a `testEnvironment` option to customize the sandbox environment.
- Added support for `@scoped/name` npm packages.
- Added an integration test runner for Jest that runs all tests for examples and packages.

## 0.8.2

- Performance improvements.
- jest now uses `chalk` instead of its own colors implementation.

## 0.8.1

- `--bail` now reports with the proper error code.
- Fixed loading of the setup file when using jasmine2.
- Updated jsdom to 7.2.0.

## 0.8.0

- Added optional support for jasmine2 through the `testRunner` config option.
- Fixed mocking support for Map, WeakMap and Set.
- `node` was added to the defaults in `moduleFileExtensions`.
- Updated the list of node core modules that are properly being recognized by the module loader.

## 0.7.1

- Correctly map `process.on` into jsdom environments, fixes a bug introduced in jest 0.7.0.

## 0.7.0

- Fixed a memory leak with test contexts. Jest now properly cleans up test environments after each test. Added `--logHeapUsage` to log memory usage after each test. Note: this is option is meant for debugging memory leaks and might significantly slow down your test run.
- Removed `mock-modules`, `node-haste` and `mocks` virtual modules. This is a breaking change of undocumented public API. Usage of this API can safely be automatically updated through an automated codemod:
- Example: http://astexplorer.net/#/zrybZ6UvRA
- Codemod: https://github.com/cpojer/js-codemod/blob/main/transforms/jest-update.js
- jscodeshift: https://github.com/facebook/jscodeshift
- Removed `navigator.onLine` and `mockSetReadOnlyProperty` from the global jsdom environment. Use `window.navigator.onLine = true;` in your test setup and `Object.defineProperty` instead.

## 0.6.1

- Updated jsdom to 7.0.2.
- Use the current working directory as root when passing a jest config from the command line.
- Updated the React examples and getting started guide
- Modules now receive a `module.parent` field so unmocked modules don't assume they are run directly any longer.

## 0.6.0

- jest now reports the number of tests that were run instead of the number of test files.
- Added a `--json` option to print test results as JSON.
- Changed the preprocessor API. A preprocessor now receives the script, file and config. The cache key function receives the script, file and stringified config to be able to create consistent hashes.
- Removed node-worker-pool in favor of node-worker-farm (#540).
- `toEqual` now also checks the internal class name of an object. This fixes invalid tests like `expect([]).toEqual({})` which were previously passing.
- Added the option to provide map modules to stub modules by providing the `moduleNameMapper` config option.
- Allow to specify a custom `testRunner` in the configuration (#531).
- Added a `--no-cache` option to make it easier to debug preprocessor scripts.
- Fix code coverage on windows (#499).

## 0.5.6

- Cache test run performance and run slowest tests first to maximize worker utilization
- Update to jsdom 6.5.0

## 0.5.5

- Improve failure stack traces.
- Fix syntax error reporting.
- Add `--watch` option (#472).

## 0.5.2

- Fixed a bug with syntax errors in test files (#487).
- Fixed chmod error for preprocess-cache (#491).
- Support for the upcoming node 4.0 release (#490, #489).

## 0.5.1

- Upgraded node-worker-pool to 3.0.0, use the native `Promise` implementation.
- `testURL` can be used to set the location of the jsdom environment.
- Updated all of jest's dependencies, now using jsdom 6.3.
- jest now uses the native `Promise` implementation.
- Fixed a bug when passed an empty `testPathIgnorePatterns`.
- Moved preprocessor cache into the haste cache directory.

## 0.5.0

- Added `--noStackTrace` option to disable stack traces.
- Jest now only works with iojs v2 and up. If you are still using node we recommend upgrading to iojs or keep using jest 0.4.0.
- Upgraded to jsdom 6.1.0 and removed all the custom jsdom overwrites.

## <=0.4.0

- See commit history for changes in previous versions of jest.
