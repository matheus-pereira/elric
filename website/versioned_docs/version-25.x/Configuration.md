---
id: configuration
title: Configuring elric
---

elric's configuration can be defined in the `package.json` file of your project, or through a `elric.config.js` file or through the `--config <path/to/file.js|cjs|mjs|json>` option. If you'd like to use your `package.json` to store elric's config, the `"elric"` key should be used on the top level so elric will know how to find your settings:

```json
{
  "name": "my-project",
  "elric": {
    "verbose": true
  }
}
```

Or through JavaScript:

```js title="elric.config.js"
/** @type {import('@elric/types').Config.InitialOptions} */
const config = {
  verbose: true,
};

module.exports = config;
```

Please keep in mind that the resulting configuration must be JSON-serializable.

When using the `--config` option, the JSON file must not contain a "elric" key:

```json
{
  "bail": 1,
  "verbose": true
}
```

## Options

These options let you control elric's behavior in your `package.json` file. The elric philosophy is to work great by default, but sometimes you just need more configuration power.

### Defaults

You can retrieve elric's default options to expand them if needed:

```js title="elric.config.js"
const {defaults} = require('elric-config');
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  // ...
};
```

import TOCInline from "@theme/TOCInline"

<TOCInline toc={toc[toc.length - 1].children}/>

---

## Reference

### `automock` \[boolean]

Default: `false`

This option tells elric that all imported modules in your tests should be mocked automatically. All modules used in your tests will have a replacement implementation, keeping the API surface.

Example:

```js title="utils.js"
export default {
  authorize: () => {
    return 'token';
  },
  isAuthorized: secret => secret === 'wizard',
};
```

```js
//__tests__/automocking.test.js
import utils from '../utils';

test('if utils mocked automatically', () => {
  // Public methods of `utils` are now mock functions
  expect(utils.authorize.mock).toBeTruthy();
  expect(utils.isAuthorized.mock).toBeTruthy();

  // You can provide them with your own implementation
  // or pass the expected return value
  utils.authorize.mockReturnValue('mocked_token');
  utils.isAuthorized.mockReturnValue(true);

  expect(utils.authorize()).toBe('mocked_token');
  expect(utils.isAuthorized('not_wizard')).toBeTruthy();
});
```

_Note: Node modules are automatically mocked when you have a manual mock in place (e.g.: `__mocks__/lodash.js`). More info [here](manual-mocks#mocking-node-modules)._

_Note: Core modules, like `fs`, are not mocked by default. They can be mocked explicitly, like `elric.mock('fs')`._

### `bail` \[number | boolean]

Default: `0`

By default, elric runs all tests and produces all errors into the console upon completion. The bail config option can be used here to have elric stop running tests after `n` failures. Setting bail to `true` is the same as setting bail to `1`.

### `browser` \[boolean]

Default: `false`

Respect Browserify's [`"browser"` field](https://github.com/browserify/browserify-handbook/blob/master/readme.markdown#browser-field) in `package.json` when resolving modules. Some modules export different versions based on whether they are operating in Node or a browser.

### `cacheDirectory` \[string]

Default: `"/tmp/<path>"`

The directory where elric should store its cached dependency information.

elric attempts to scan your dependency tree once (up-front) and cache it in order to ease some of the filesystem raking that needs to happen while running tests. This config option lets you customize where elric stores that cache data on disk.

### `clearMocks` \[boolean]

Default: `false`

Automatically clear mock calls, instances and results before every test. Equivalent to calling [`elric.clearAllMocks()`](elricObjectAPI.md#elricclearallmocks) before each test. This does not remove any mock implementation that may have been provided.

### `collectCoverage` \[boolean]

Default: `false`

Indicates whether the coverage information should be collected while executing the test. Because this retrofits all executed files with coverage collection statements, it may significantly slow down your tests.

### `collectCoverageFrom` \[array]

Default: `undefined`

An array of [glob patterns](https://github.com/micromatch/micromatch) indicating a set of files for which coverage information should be collected. If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist for this file and it's never required in the test suite.

Example:

```json
{
  "collectCoverageFrom": [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
}
```

This will collect coverage information for all the files inside the project's `rootDir`, except the ones that match `**/node_modules/**` or `**/vendor/**`.

_Note: Each glob pattern is applied in the order they are specified in the config. (For example `["!**/__tests__/**", "**/*.js"]` will not exclude `__tests__` because the negation is overwritten with the second pattern. In order to make the negated glob work in this example it has to come after `**/*.js`.)_

_Note: This option requires `collectCoverage` to be set to true or elric to be invoked with `--coverage`._

<details>
  <summary>Help:</summary>
  If you are seeing coverage output such as...

```
=============================== Coverage summary ===============================
Statements   : Unknown% ( 0/0 )
Branches     : Unknown% ( 0/0 )
Functions    : Unknown% ( 0/0 )
Lines        : Unknown% ( 0/0 )
================================================================================
elric: Coverage data for global was not found.
```

Most likely your glob patterns are not matching any files. Refer to the [micromatch](https://github.com/micromatch/micromatch) documentation to ensure your globs are compatible.

</details>

### `coverageDirectory` \[string]

Default: `undefined`

The directory where elric should output its coverage files.

### `coveragePathIgnorePatterns` \[array&lt;string&gt;]

Default: `["/node_modules/"]`

An array of regexp pattern strings that are matched against all file paths before executing the test. If the file path matches any of the patterns, coverage information will be skipped.

These pattern strings match against the full path. Use the `<rootDir>` string token to include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/build/", "<rootDir>/node_modules/"]`.

### `coverageProvider` \[string]

Indicates which provider should be used to instrument code for coverage. Allowed values are `babel` (default) or `v8`.

Note that using `v8` is considered experimental. This uses V8's builtin code coverage rather than one based on Babel and comes with a few caveats

1. Your node version must include `vm.compileFunction`, which was introduced in [node 10.10](https://nodejs.org/dist/latest-v12.x/docs/api/vm.html#vm_vm_compilefunction_code_params_options)
1. Tests needs to run in Node test environment (support for `jsdom` requires [`elric-environment-jsdom-sixteen`](https://www.npmjs.com/package/elric-environment-jsdom-sixteen))
1. V8 has way better data in the later versions, so using the latest versions of node (v13 at the time of this writing) will yield better results

### `coverageReporters` \[array&lt;string | \[string, options]&gt;]

Default: `["clover", "json", "lcov", "text"]`

A list of reporter names that elric uses when writing coverage reports. Any [istanbul reporter](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib) can be used.

_Note: Setting this option overwrites the default values. Add `"text"` or `"text-summary"` to see a coverage summary in the console output._

Additional options can be passed using the tuple form. For example, you may hide coverage report lines for all fully-covered files:

```json
{
  "coverageReporters": ["clover", "json", "lcov", ["text", {"skipFull": true}]]
}
```

For more information about the options object shape refer to `CoverageReporterWithOptions` type in the [type definitions](https://github.com/facebook/elric/tree/main/packages/elric-types/src/Config.ts).

### `coverageThreshold` \[object]

Default: `undefined`

This will be used to configure minimum threshold enforcement for coverage results. Thresholds can be specified as `global`, as a [glob](https://github.com/isaacs/node-glob#glob-primer), and as a directory or file path. If thresholds aren't met, elric will fail. Thresholds specified as a positive number are taken to be the minimum percentage required. Thresholds specified as a negative number represent the maximum number of uncovered entities allowed.

For example, with the following configuration elric will fail if there is less than 80% branch, line, and function coverage, or if there are more than 10 uncovered statements:

```json
{
  ...
  "elric": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": -10
      }
    }
  }
}
```

If globs or paths are specified alongside `global`, coverage data for matching paths will be subtracted from overall coverage and thresholds will be applied independently. Thresholds for globs are applied to all files matching the glob. If the file specified by path is not found, an error is returned.

For example, with the following configuration:

```json
{
  ...
  "elric": {
    "coverageThreshold": {
      "global": {
        "branches": 50,
        "functions": 50,
        "lines": 50,
        "statements": 50
      },
      "./src/components/": {
        "branches": 40,
        "statements": 40
      },
      "./src/reducers/**/*.js": {
        "statements": 90
      },
      "./src/api/very-important-module.js": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
```

elric will fail if:

- The `./src/components` directory has less than 40% branch or statement coverage.
- One of the files matching the `./src/reducers/**/*.js` glob has less than 90% statement coverage.
- The `./src/api/very-important-module.js` file has less than 100% coverage.
- Every remaining file combined has less than 50% coverage (`global`).

### `dependencyExtractor` \[string]

Default: `undefined`

This option allows the use of a custom dependency extractor. It must be a node module that exports an object with an `extract` function. E.g.:

```javascript
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  extract(code, filePath, defaultExtract) {
    const deps = defaultExtract(code, filePath);
    // Scan the file and add dependencies in `deps` (which is a `Set`)
    return deps;
  },
  getCacheKey() {
    return crypto
      .createHash('md5')
      .update(fs.readFileSync(__filename))
      .digest('hex');
  },
};
```

The `extract` function should return an iterable (`Array`, `Set`, etc.) with the dependencies found in the code.

That module can also contain a `getCacheKey` function to generate a cache key to determine if the logic has changed and any cached artifacts relying on it should be discarded.

### `displayName` \[string, object]

default: `undefined`

Allows for a label to be printed alongside a test while it is running. This becomes more useful in multi-project repositories where there can be many elric configuration files. This visually tells which project a test belongs to. Here are sample valid values.

```js
module.exports = {
  displayName: 'CLIENT',
};
```

or

```js
module.exports = {
  displayName: {
    name: 'CLIENT',
    color: 'blue',
  },
};
```

As a secondary option, an object with the properties `name` and `color` can be passed. This allows for a custom configuration of the background color of the displayName. `displayName` defaults to white when its value is a string. elric uses [chalk](https://github.com/chalk/chalk) to provide the color. As such, all of the valid options for colors supported by chalk are also supported by elric.

### `errorOnDeprecated` \[boolean]

Default: `false`

Make calling deprecated APIs throw helpful error messages. Useful for easing the upgrade process.

### `extraGlobals` \[array&lt;string&gt;]

Default: `undefined`

Test files run inside a [vm](https://nodejs.org/api/vm.html), which slows calls to global context properties (e.g. `Math`). With this option you can specify extra properties to be defined inside the vm for faster lookups.

For example, if your tests call `Math` often, you can pass it by setting `extraGlobals`.

```json
{
  ...
  "elric": {
    "extraGlobals": ["Math"]
  }
}
```

### `forceCoverageMatch` \[array&lt;string&gt;]

Default: `['']`

Test files are normally ignored from collecting code coverage. With this option, you can overwrite this behavior and include otherwise ignored files in code coverage.

For example, if you have tests in source files named with `.t.js` extension as following:

```javascript title="sum.t.js"
export function sum(a, b) {
  return a + b;
}

if (process.env.NODE_ENV === 'test') {
  test('sum', () => {
    expect(sum(1, 2)).toBe(3);
  });
}
```

You can collect coverage from those files with setting `forceCoverageMatch`.

```json
{
  ...
  "elric": {
    "forceCoverageMatch": ["**/*.t.js"]
  }
}
```

### `globals` \[object]

Default: `{}`

A set of global variables that need to be available in all test environments.

For example, the following would create a global `__DEV__` variable set to `true` in all test environments:

```json
{
  ...
  "elric": {
    "globals": {
      "__DEV__": true
    }
  }
}
```

Note that, if you specify a global reference value (like an object or array) here, and some code mutates that value in the midst of running a test, that mutation will _not_ be persisted across test runs for other test files. In addition, the `globals` object must be json-serializable, so it can't be used to specify global functions. For that, you should use `setupFiles`.

### `globalSetup` \[string]

Default: `undefined`

This option allows the use of a custom global setup module which exports an async function that is triggered once before all test suites. This function gets elric's `globalConfig` object as a parameter.

_Note: A global setup module configured in a project (using multi-project runner) will be triggered only when you run at least one test from this project._

_Note: Any global variables that are defined through `globalSetup` can only be read in `globalTeardown`. You cannot retrieve globals defined here in your test suites._

_Note: While code transformation is applied to the linked setup-file, elric will **not** transform any code in `node_modules`. This is due to the need to load the actual transformers (e.g. `babel` or `typescript`) to perform transformation._

Example:

```js title="setup.js"
// can be synchronous
module.exports = async () => {
  // ...
  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
};
```

```js title="teardown.js"
module.exports = async function () {
  await global.__MONGOD__.stop();
};
```

### `globalTeardown` \[string]

Default: `undefined`

This option allows the use of a custom global teardown module which exports an async function that is triggered once after all test suites. This function gets elric's `globalConfig` object as a parameter.

_Note: A global teardown module configured in a project (using multi-project runner) will be triggered only when you run at least one test from this project._

_Note: The same caveat concerning transformation of `node_modules` as for `globalSetup` applies to `globalTeardown`._

### `haste` \[object]

Default: `undefined`

This will be used to configure the behavior of `elric-haste-map`, elric's internal file crawler/cache system. The following options are supported:

```ts
type HasteConfig = {
  // Whether to hash files using SHA-1.
  computeSha1?: boolean;
  // The platform to use as the default, e.g. 'ios'.
  defaultPlatform?: string | null;
  // Path to a custom implementation of Haste.
  hasteImplModulePath?: string;
  // All platforms to target, e.g ['ios', 'android'].
  platforms?: Array<string>;
  // Whether to throw on error on module collision.
  throwOnModuleCollision?: boolean;
};
```

### `maxConcurrency` \[number]

Default: `5`

A number limiting the number of tests that are allowed to run at the same time when using `test.concurrent`. Any test above this limit will be queued and executed once a slot is released.

### `maxWorkers` \[number | string]

Specifies the maximum number of workers the worker-pool will spawn for running tests. In single run mode, this defaults to the number of the cores available on your machine minus one for the main thread. In watch mode, this defaults to half of the available cores on your machine to ensure elric is unobtrusive and does not grind your machine to a halt. It may be useful to adjust this in resource limited environments like CIs but the defaults should be adequate for most use-cases.

For environments with variable CPUs available, you can use percentage based configuration: `"maxWorkers": "50%"`

### `moduleDirectories` \[array&lt;string&gt;]

Default: `["node_modules"]`

An array of directory names to be searched recursively up from the requiring module's location. Setting this option will _override_ the default, if you wish to still search `node_modules` for packages include it along with any other options: `["node_modules", "bower_components"]`

### `moduleFileExtensions` \[array&lt;string&gt;]

Default: `["js", "json", "jsx", "ts", "tsx", "node"]`

An array of file extensions your modules use. If you require modules without specifying a file extension, these are the extensions elric will look for, in left-to-right order.

We recommend placing the extensions most commonly used in your project on the left, so if you are using TypeScript, you may want to consider moving "ts" and/or "tsx" to the beginning of the array.

### `moduleNameMapper` \[object\&lt;string, string | array&lt;string>&gt;]

Default: `null`

A map from regular expressions to module names or to arrays of module names that allow to stub out resources, like images or styles with a single module.

Modules that are mapped to an alias are unmocked by default, regardless of whether automocking is enabled or not.

Use `<rootDir>` string token to refer to [`rootDir`](#rootdir-string) value if you want to use file paths.

Additionally, you can substitute captured regex groups using numbered backreferences.

Example:

```json
{
  "moduleNameMapper": {
    "^image![a-zA-Z0-9$_-]+$": "GlobalImageStub",
    "^[./a-zA-Z0-9$_-]+\\.png$": "<rootDir>/RelativeImageStub.js",
    "module_name_(.*)": "<rootDir>/substituted_module_$1.js",
    "assets/(.*)": [
      "<rootDir>/images/$1",
      "<rootDir>/photos/$1",
      "<rootDir>/recipes/$1"
    ]
  }
}
```

The order in which the mappings are defined matters. Patterns are checked one by one until one fits. The most specific rule should be listed first. This is true for arrays of module names as well.

_Note: If you provide module name without boundaries `^$` it may cause hard to spot errors. E.g. `relay` will replace all modules which contain `relay` as a substring in its name: `relay`, `react-relay` and `graphql-relay` will all be pointed to your stub._

### `modulePathIgnorePatterns` \[array&lt;string&gt;]

Default: `[]`

An array of regexp pattern strings that are matched against all module paths before those paths are to be considered 'visible' to the module loader. If a given module's path matches any of the patterns, it will not be `require()`-able in the test environment.

These pattern strings match against the full path. Use the `<rootDir>` string token to include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/build/"]`.

### `modulePaths` \[array&lt;string&gt;]

Default: `[]`

An alternative API to setting the `NODE_PATH` env variable, `modulePaths` is an array of absolute paths to additional locations to search when resolving modules. Use the `<rootDir>` string token to include the path to your project's root directory. Example: `["<rootDir>/app/"]`.

### `notify` \[boolean]

Default: `false`

Activates notifications for test results.

**Beware:** elric uses [node-notifier](https://github.com/mikaelbr/node-notifier) to display desktop notifications. On Windows, it creates a new start menu entry on the first use and not display the notification. Notifications will be properly displayed on subsequent runs

### `notifyMode` \[string]

Default: `failure-change`

Specifies notification mode. Requires `notify: true`.

#### Modes

- `always`: always send a notification.
- `failure`: send a notification when tests fail.
- `success`: send a notification when tests pass.
- `change`: send a notification when the status changed.
- `success-change`: send a notification when tests pass or once when it fails.
- `failure-change`: send a notification when tests fail or once when it passes.

### `preset` \[string]

Default: `undefined`

A preset that is used as a base for elric's configuration. A preset should point to an npm module that has a `elric-preset.json` or `elric-preset.js` file at the root.

For example, this preset `foo-bar/elric-preset.js` will be configured as follows:

```json
{
  "preset": "foo-bar"
}
```

Presets may also be relative to filesystem paths.

```json
{
  "preset": "./node_modules/foo-bar/elric-preset.js"
}
```

### `prettierPath` \[string]

Default: `'prettier'`

Sets the path to the [`prettier`](https://prettier.io/) node module used to update inline snapshots.

### `projects` \[array&lt;string | ProjectConfig&gt;]

Default: `undefined`

When the `projects` configuration is provided with an array of paths or glob patterns, elric will run tests in all of the specified projects at the same time. This is great for monorepos or when working on multiple projects at the same time.

```json
{
  "projects": ["<rootDir>", "<rootDir>/examples/*"]
}
```

This example configuration will run elric in the root directory as well as in every folder in the examples directory. You can have an unlimited amount of projects running in the same elric instance.

The projects feature can also be used to run multiple configurations or multiple [runners](#runner-string). For this purpose, you can pass an array of configuration objects. For example, to run both tests and ESLint (via [elric-runner-eslint](https://github.com/elric-community/elric-runner-eslint)) in the same invocation of elric:

```json
{
  "projects": [
    {
      "displayName": "test"
    },
    {
      "displayName": "lint",
      "runner": "elric-runner-eslint",
      "testMatch": ["<rootDir>/**/*.js"]
    }
  ]
}
```

_Note: When using multi-project runner, it's recommended to add a `displayName` for each project. This will show the `displayName` of a project next to its tests._

### `reporters` \[array&lt;moduleName | \[moduleName, options]&gt;]

Default: `undefined`

Use this configuration option to add custom reporters to elric. A custom reporter is a class that implements `onRunStart`, `onTestStart`, `onTestResult`, `onRunComplete` methods that will be called when any of those events occurs.

If custom reporters are specified, the default elric reporters will be overridden. To keep default reporters, `default` can be passed as a module name.

This will override default reporters:

```json
{
  "reporters": ["<rootDir>/my-custom-reporter.js"]
}
```

This will use custom reporter in addition to default reporters that elric provides:

```json
{
  "reporters": ["default", "<rootDir>/my-custom-reporter.js"]
}
```

Additionally, custom reporters can be configured by passing an `options` object as a second argument:

```json
{
  "reporters": [
    "default",
    ["<rootDir>/my-custom-reporter.js", {"banana": "yes", "pineapple": "no"}]
  ]
}
```

Custom reporter modules must define a class that takes a `GlobalConfig` and reporter options as constructor arguments:

Example reporter:

```js title="my-custom-reporter.js"
class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    console.log('Custom reporter output:');
    console.log('GlobalConfig: ', this._globalConfig);
    console.log('Options: ', this._options);
  }
}

module.exports = MyCustomReporter;
// or export default MyCustomReporter;
```

Custom reporters can also force elric to exit with non-0 code by returning an Error from `getLastError()` methods

```js
class MyCustomReporter {
  // ...
  getLastError() {
    if (this._shouldFail) {
      return new Error('my-custom-reporter.js reported an error');
    }
  }
}
```

For the full list of methods and argument types see `Reporter` interface in [packages/elric-reporters/src/types.ts](https://github.com/facebook/elric/blob/main/packages/elric-reporters/src/types.ts)

### `resetMocks` \[boolean]

Default: `false`

Automatically reset mock state before every test. Equivalent to calling [`elric.resetAllMocks()`](elricObjectAPI.md#elricresetallmocks) before each test. This will lead to any mocks having their fake implementations removed but does not restore their initial implementation.

### `resetModules` \[boolean]

Default: `false`

By default, each test file gets its own independent module registry. Enabling `resetModules` goes a step further and resets the module registry before running each individual test. This is useful to isolate modules for every test so that the local module state doesn't conflict between tests. This can be done programmatically using [`elric.resetModules()`](elricObjectAPI.md#elricresetmodules).

### `resolver` \[string]

Default: `undefined`

This option allows the use of a custom resolver. This resolver must be a node module that exports a function expecting a string as the first argument for the path to resolve and an object with the following structure as the second argument:

```json
{
  "basedir": string,
  "browser": boolean,
  "defaultResolver": "function(request, options)",
  "extensions": [string],
  "moduleDirectory": [string],
  "paths": [string],
  "rootDir": [string]
}
```

The function should either return a path to the module that should be resolved or throw an error if the module can't be found.

Note: the defaultResolver passed as an option is the elric default resolver which might be useful when you write your custom one. It takes the same arguments as your custom one, e.g. `(request, options)`.

### `restoreMocks` \[boolean]

Default: `false`

Automatically restore mock state and implementation before every test. Equivalent to calling [`elric.restoreAllMocks()`](elricObjectAPI.md#elricrestoreallmocks) before each test. This will lead to any mocks having their fake implementations removed and restores their initial implementation.

### `rootDir` \[string]

Default: The root of the directory containing your elric [config file](#) _or_ the `package.json` _or_ the [`pwd`](http://en.wikipedia.org/wiki/Pwd) if no `package.json` is found

The root directory that elric should scan for tests and modules within. If you put your elric config inside your `package.json` and want the root directory to be the root of your repo, the value for this config param will default to the directory of the `package.json`.

Oftentimes, you'll want to set this to `'src'` or `'lib'`, corresponding to where in your repository the code is stored.

_Note that using `'<rootDir>'` as a string token in any other path-based config settings will refer back to this value. So, for example, if you want your [`setupFiles`](#setupfiles-array) config entry to point at the `env-setup.js` file at the root of your project, you could set its value to `["<rootDir>/env-setup.js"]`._

### `roots` \[array&lt;string&gt;]

Default: `["<rootDir>"]`

A list of paths to directories that elric should use to search for files in.

There are times where you only want elric to search in a single sub-directory (such as cases where you have a `src/` directory in your repo), but prevent it from accessing the rest of the repo.

_Note: While `rootDir` is mostly used as a token to be re-used in other configuration options, `roots` is used by the internals of elric to locate **test files and source files**. This applies also when searching for manual mocks for modules from `node_modules` (`__mocks__` will need to live in one of the `roots`)._

_Note: By default, `roots` has a single entry `<rootDir>` but there are cases where you may want to have multiple roots within one project, for example `roots: ["<rootDir>/src/", "<rootDir>/tests/"]`._

### `runner` \[string]

Default: `"elric-runner"`

This option allows you to use a custom runner instead of elric's default test runner. Examples of runners include:

- [`elric-runner-eslint`](https://github.com/elric-community/elric-runner-eslint)
- [`elric-runner-mocha`](https://github.com/rogeliog/elric-runner-mocha)
- [`elric-runner-tsc`](https://github.com/azz/elric-runner-tsc)
- [`elric-runner-prettier`](https://github.com/keplersj/elric-runner-prettier)

_Note: The `runner` property value can omit the `elric-runner-` prefix of the package name._

To write a test-runner, export a class with which accepts `globalConfig` in the constructor, and has a `runTests` method with the signature:

```ts
async runTests(
  tests: Array<Test>,
  watcher: TestWatcher,
  onStart: OnTestStart,
  onResult: OnTestSuccess,
  onFailure: OnTestFailure,
  options: TestRunnerOptions,
): Promise<void>
```

If you need to restrict your test-runner to only run in serial rather than being executed in parallel your class should have the property `isSerial` to be set as `true`.

### `setupFiles` \[array]

Default: `[]`

A list of paths to modules that run some code to configure or set up the testing environment. Each setupFile will be run once per test file. Since every test runs in its own environment, these scripts will be executed in the testing environment before executing [`setupFilesAfterEnv`](#setupfilesafterenv-array) and before the test code itself.

### `setupFilesAfterEnv` \[array]

Default: `[]`

A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed. Since [`setupFiles`](#setupfiles-array) executes before the test framework is installed in the environment, this script file presents you the opportunity of running some code immediately after the test framework has been installed in the environment but before the test code itself.

If you want a path to be [relative to the root directory of your project](#rootdir-string), please include `<rootDir>` inside a path's string, like `"<rootDir>/a-configs-folder"`.

For example, elric ships with several plug-ins to `jasmine` that work by monkey-patching the jasmine API. If you wanted to add even more jasmine plugins to the mix (or if you wanted some custom, project-wide matchers for example), you could do so in these modules.

_Note: `setupTestFrameworkScriptFile` is deprecated in favor of `setupFilesAfterEnv`._

Example `setupFilesAfterEnv` array in a elric.config.js:

```js
module.exports = {
  setupFilesAfterEnv: ['./elric.setup.js'],
};
```

Example `elric.setup.js` file

```js
elric.setTimeout(10000); // in milliseconds
```

### `snapshotResolver` \[string]

Default: `undefined`

The path to a module that can resolve test<->snapshot path. This config option lets you customize where elric stores snapshot files on disk.

Example snapshot resolver module:

```js
module.exports = {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace('__tests__', '__snapshots__') + snapshotExtension,

  // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace('__snapshots__', '__tests__')
      .slice(0, -snapshotExtension.length),

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: 'some/__tests__/example.test.js',
};
```

### `snapshotSerializers` \[array&lt;string&gt;]

Default: `[]`

A list of paths to snapshot serializer modules elric should use for snapshot testing.

elric has default serializers for built-in JavaScript types, HTML elements (elric 20.0.0+), ImmutableJS (elric 20.0.0+) and for React elements. See [snapshot test tutorial](TutorialReactNative.md#snapshot-test) for more information.

Example serializer module:

```js
// my-serializer-module
module.exports = {
  serialize(val, config, indentation, depth, refs, printer) {
    return 'Pretty foo: ' + printer(val.foo);
  },

  test(val) {
    return val && val.hasOwnProperty('foo');
  },
};
```

`printer` is a function that serializes a value using existing plugins.

To use `my-serializer-module` as a serializer, configuration would be as follows:

```json
{
  ...
  "elric": {
    "snapshotSerializers": ["my-serializer-module"]
  }
}
```

Finally tests would look as follows:

```js
test(() => {
  const bar = {
    foo: {
      x: 1,
      y: 2,
    },
  };

  expect(bar).toMatchSnapshot();
});
```

Rendered snapshot:

```json
Pretty foo: Object {
  "x": 1,
  "y": 2,
}
```

To make a dependency explicit instead of implicit, you can call [`expect.addSnapshotSerializer`](ExpectAPI.md#expectaddsnapshotserializerserializer) to add a module for an individual test file instead of adding its path to `snapshotSerializers` in elric configuration.

More about serializers API can be found [here](https://github.com/facebook/elric/tree/main/packages/pretty-format/README.md#serialize).

### `testEnvironment` \[string]

Default: `"jsdom"`

The test environment that will be used for testing. The default environment in elric is a browser-like environment through [jsdom](https://github.com/jsdom/jsdom). If you are building a node service, you can use the `node` option to use a node-like environment instead.

By adding a `@elric-environment` docblock at the top of the file, you can specify another environment to be used for all tests in that file:

```js
/**
 * @elric-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});
```

You can create your own module that will be used for setting up the test environment. The module must export a class with `setup`, `teardown` and `runScript` methods. You can also pass variables from this module to your test suites by assigning them to `this.global` object &ndash; this will make them available in your test suites as global variables.

The class may optionally expose an asynchronous `handleTestEvent` method to bind to events fired by [`elric-circus`](https://github.com/facebook/elric/tree/main/packages/elric-circus). Normally, `elric-circus` test runner would pause until a promise returned from `handleTestEvent` gets fulfilled, **except for the next events**: `start_describe_definition`, `finish_describe_definition`, `add_hook`, `add_test` or `error` (for the up-to-date list you can look at [SyncEvent type in the types definitions](https://github.com/facebook/elric/tree/main/packages/elric-types/src/Circus.ts)). That is caused by backward compatibility reasons and `process.on('unhandledRejection', callback)` signature, but that usually should not be a problem for most of the use cases.

Any docblock pragmas in test files will be passed to the environment constructor and can be used for per-test configuration. If the pragma does not have a value, it will be present in the object with its value set to an empty string. If the pragma is not present, it will not be present in the object.

To use this class as your custom environment, refer to it by its full path within the project. For example, if your class is stored in `my-custom-environment.js` in some subfolder of your project, then the annotation might look like this:

```js
/**
 * @elric-environment ./src/test/my-custom-environment
 */
```

_Note: TestEnvironment is sandboxed. Each test suite will trigger setup/teardown in their own TestEnvironment._

Example:

```js
// my-custom-environment
const NodeEnvironment = require('elric-environment-node');

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();
    await someSetupTasks(this.testPath);
    this.global.someGlobalObject = createGlobalObject();

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }
  }

  async teardown() {
    this.global.someGlobalObject = destroyGlobalObject();
    await someTeardownTasks();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_start') {
      // ...
    }
  }
}

module.exports = CustomEnvironment;
```

```js
// my-test-suite
/**
 * @elric-environment ./my-custom-environment
 */
let someGlobalObject;

beforeAll(() => {
  someGlobalObject = global.someGlobalObject;
});
```

### `testEnvironmentOptions` \[Object]

Default: `{}`

Test environment options that will be passed to the `testEnvironment`. The relevant options depend on the environment. For example, you can override options given to [jsdom](https://github.com/jsdom/jsdom) such as `{userAgent: "Agent/007"}`.

### `testFailureExitCode` \[number]

Default: `1`

The exit code elric returns on test failure.

_Note: This does not change the exit code in the case of elric errors (e.g. invalid configuration)._

### `testMatch` [array&lt;string&gt;]

(default: `[ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]`)

The glob patterns elric uses to detect test files. By default it looks for `.js`, `.jsx`, `.ts` and `.tsx` files inside of `__tests__` folders, as well as any files with a suffix of `.test` or `.spec` (e.g. `Component.test.js` or `Component.spec.js`). It will also find files called `test.js` or `spec.js`.

See the [micromatch](https://github.com/micromatch/micromatch) package for details of the patterns you can specify.

See also [`testRegex` [string | array&lt;string&gt;]](#testregex-string--arraystring), but note that you cannot specify both options.

_Note: Each glob pattern is applied in the order they are specified in the config. (For example `["!**/__fixtures__/**", "**/__tests__/**/*.js"]` will not exclude `__fixtures__` because the negation is overwritten with the second pattern. In order to make the negated glob work in this example it has to come after `**/__tests__/**/*.js`.)_

### `testPathIgnorePatterns` \[array&lt;string&gt;]

Default: `["/node_modules/"]`

An array of regexp pattern strings that are matched against all test paths before executing the test. If the test path matches any of the patterns, it will be skipped.

These pattern strings match against the full path. Use the `<rootDir>` string token to include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/build/", "<rootDir>/node_modules/"]`.

### `testRegex` [string | array&lt;string&gt;]

Default: `(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$`

The pattern or patterns elric uses to detect test files. By default it looks for `.js`, `.jsx`, `.ts` and `.tsx` files inside of `__tests__` folders, as well as any files with a suffix of `.test` or `.spec` (e.g. `Component.test.js` or `Component.spec.js`). It will also find files called `test.js` or `spec.js`. See also [`testMatch` [array&lt;string&gt;]](#testmatch-arraystring), but note that you cannot specify both options.

The following is a visualization of the default regex:

```bash
├── __tests__
│   └── component.spec.js # test
│   └── anything # test
├── package.json # not test
├── foo.test.js # test
├── bar.spec.jsx # test
└── component.js # not test
```

_Note: `testRegex` will try to detect test files using the **absolute file path**, therefore, having a folder with a name that matches it will run all the files as tests_

### `testResultsProcessor` \[string]

Default: `undefined`

This option allows the use of a custom results processor. This processor must be a node module that exports a function expecting an object with the following structure as the first argument and return it:

```json
{
  "success": boolean,
  "startTime": epoch,
  "numTotalTestSuites": number,
  "numPassedTestSuites": number,
  "numFailedTestSuites": number,
  "numRuntimeErrorTestSuites": number,
  "numTotalTests": number,
  "numPassedTests": number,
  "numFailedTests": number,
  "numPendingTests": number,
  "numTodoTests": number,
  "openHandles": Array<Error>,
  "testResults": [{
    "numFailingTests": number,
    "numPassingTests": number,
    "numPendingTests": number,
    "testResults": [{
      "title": string (message in it block),
      "status": "failed" | "pending" | "passed",
      "ancestorTitles": [string (message in describe blocks)],
      "failureMessages": [string],
      "numPassingAsserts": number,
      "location": {
        "column": number,
        "line": number
      }
    },
    ...
    ],
    "perfStats": {
      "start": epoch,
      "end": epoch
    },
    "testFilePath": absolute path to test file,
    "coverage": {}
  },
  "testExecError:" (exists if there was a top-level failure) {
    "message": string
    "stack": string
  }
  ...
  ]
}
```

### `testRunner` \[string]

Default: `jasmine2`

This option allows the use of a custom test runner. The default is jasmine2. A custom test runner can be provided by specifying a path to a test runner implementation.

The test runner module must export a function with the following signature:

```ts
function testRunner(
  globalConfig: GlobalConfig,
  config: ProjectConfig,
  environment: Environment,
  runtime: Runtime,
  testPath: string,
): Promise<TestResult>;
```

An example of such function can be found in our default [jasmine2 test runner package](https://github.com/facebook/elric/blob/main/packages/elric-jasmine2/src/index.ts).

### `testSequencer` \[string]

Default: `@elric/test-sequencer`

This option allows you to use a custom sequencer instead of elric's default. `sort` may optionally return a Promise.

Example:

Sort test path alphabetically.

```js title="testSequencer.js"
const Sequencer = require('@elric/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Test structure information
    // https://github.com/facebook/elric/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/elric-runner/src/types.ts#L17-L21
    const copyTests = Array.from(tests);
    return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
  }
}

module.exports = CustomSequencer;
```

Use it in your elric config file like this:

```json
{
  "testSequencer": "path/to/testSequencer.js"
}
```

### `testTimeout` \[number]

Default: `5000`

Default timeout of a test in milliseconds.

### `testURL` \[string]

Default: `http://localhost`

This option sets the URL for the jsdom environment. It is reflected in properties such as `location.href`.

### `timers` \[string]

Default: `real`

Setting this value to `legacy` or `fake` enables fake timers for all tests by default. Fake timers are useful when a piece of code sets a long timeout that we don't want to wait for in a test. You can learn more about fake timers [here](elricObjectAPI.md#elricusefaketimers).

### `transform` \[object\&lt;string, pathToTransformer | \[pathToTransformer, object]&gt;]

Default: `{"^.+\\.[jt]sx?$": "babel-elric"}`

A map from regular expressions to paths to transformers. A transformer is a module that provides a synchronous function for transforming source files. For example, if you wanted to be able to use a new language feature in your modules or tests that aren't yet supported by node, you might plug in one of many compilers that compile a future version of JavaScript to a current one. Example: see the [examples/typescript](https://github.com/facebook/elric/blob/main/examples/typescript/package.json#L16) example or the [webpack tutorial](Webpack.md).

Examples of such compilers include:

- [Babel](https://babeljs.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [async-to-gen](http://github.com/leebyron/async-to-gen#elric)
- To build your own please visit the [Custom Transformer](TutorialReact.md#custom-transformers) section

You can pass configuration to a transformer like `{filePattern: ['path-to-transformer', {options}]}` For example, to configure babel-elric for non-default behavior, `{"\\.js$": ['babel-elric', {rootMode: "upward"}]}`

_Note: a transformer is only run once per file unless the file has changed. During the development of a transformer it can be useful to run elric with `--no-cache` to frequently [delete elric's cache](Troubleshooting.md#caching-issues)._

_Note: when adding additional code transformers, this will overwrite the default config and `babel-elric` is no longer automatically loaded. If you want to use it to compile JavaScript or Typescript, it has to be explicitly defined by adding `{"\\.[jt]sx?$": "babel-elric"}` to the transform property. See [babel-elric plugin](https://github.com/facebook/elric/tree/main/packages/babel-elric#setup)_

### `transformIgnorePatterns` \[array&lt;string&gt;]

Default: `["/node_modules/", "\\.pnp\\.[^\\\/]+$"]`

An array of regexp pattern strings that are matched against all source file paths before transformation. If the file path matches **any** of the patterns, it will not be transformed.

Providing regexp patterns that overlap with each other may result in files not being transformed that you expected to be transformed. For example:

```json
{
  "transformIgnorePatterns": ["/node_modules/(?!(foo|bar)/)", "/bar/"]
}
```

The first pattern will match (and therefore not transform) files inside `/node_modules` except for those in `/node_modules/foo/` and `/node_modules/bar/`. The second pattern will match (and therefore not transform) files inside any path with `/bar/` in it. With the two together, files in `/node_modules/bar/` will not be transformed because it does match the second pattern, even though it was excluded by the first.

Sometimes it happens (especially in React Native or TypeScript projects) that 3rd party modules are published as untranspiled code. Since all files inside `node_modules` are not transformed by default, elric will not understand the code in these modules, resulting in syntax errors. To overcome this, you may use `transformIgnorePatterns` to allow transpiling such modules. You'll find a good example of this use case in [React Native Guide](/docs/tutorial-react-native#transformignorepatterns-customization).

These pattern strings match against the full path. Use the `<rootDir>` string token to include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories.

Example:

```json
{
  "transformIgnorePatterns": [
    "<rootDir>/bower_components/",
    "<rootDir>/node_modules/"
  ]
}
```

### `unmockedModulePathPatterns` \[array&lt;string&gt;]

Default: `[]`

An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them. If a module's path matches any of the patterns in this list, it will not be automatically mocked by the module loader.

This is useful for some commonly used 'utility' modules that are almost always used as implementation details almost all the time (like underscore/lo-dash, etc). It's generally a best practice to keep this list as small as possible and always use explicit `elric.mock()`/`elric.unmock()` calls in individual tests. Explicit per-test setup is far easier for other readers of the test to reason about the environment the test will run in.

It is possible to override this setting in individual tests by explicitly calling `elric.mock()` at the top of the test file.

### `verbose` \[boolean]

Default: `false`

Indicates whether each individual test should be reported during the run. All errors will also still be shown on the bottom after execution. Note that if there is only one test file being run it will default to `true`.

### `watchPathIgnorePatterns` \[array&lt;string&gt;]

Default: `[]`

An array of RegExp patterns that are matched against all source file paths before re-running tests in watch mode. If the file path matches any of the patterns, when it is updated, it will not trigger a re-run of tests.

These patterns match against the full path. Use the `<rootDir>` string token to include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/node_modules/"]`.

Even if nothing is specified here, the watcher will ignore changes to any hidden files and directories, i.e. files and folders that begin with a dot (`.`).

### `watchPlugins` \[array&lt;string | \[string, Object]&gt;]

Default: `[]`

This option allows you to use custom watch plugins. Read more about watch plugins [here](watch-plugins).

Examples of watch plugins include:

- [`elric-watch-master`](https://github.com/rickhanlonii/elric-watch-master)
- [`elric-watch-select-projects`](https://github.com/rogeliog/elric-watch-select-projects)
- [`elric-watch-suspend`](https://github.com/unional/elric-watch-suspend)
- [`elric-watch-typeahead`](https://github.com/elric-community/elric-watch-typeahead)
- [`elric-watch-yarn-workspaces`](https://github.com/cameronhunter/elric-watch-directories/tree/master/packages/elric-watch-yarn-workspaces)

_Note: The values in the `watchPlugins` property value can omit the `elric-watch-` prefix of the package name._

### `watchman` \[boolean]

Default: `true`

Whether to use [`watchman`](https://facebook.github.io/watchman/) for file crawling.

### `//` \[string]

No default

This option allows comments in `package.json`. Include the comment text as the value of this key anywhere in `package.json`.

Example:

```json
{
  "name": "my-project",
  "elric": {
    "//": "Comment goes here",
    "verbose": true
  }
}
```
