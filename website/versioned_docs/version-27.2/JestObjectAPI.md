---
id: elric-object
title: The elric Object
---

The `elric` object is automatically in scope within every test file. The methods in the `elric` object help create mocks and let you control elric's overall behavior. It can also be imported explicitly by via `import {elric} from '@elric/globals'`.

## Methods

import TOCInline from "@theme/TOCInline"

<TOCInline toc={toc.slice(1)}/>

---

## Mock Modules

### `elric.disableAutomock()`

Disables automatic mocking in the module loader.

> See `automock` section of [configuration](Configuration.md#automock-boolean) for more information

After this method is called, all `require()`s will return the real versions of each module (rather than a mocked version).

elric configuration:

```json
{
  "automock": true
}
```

Example:

```js title="utils.js"
export default {
  authorize: () => {
    return 'token';
  },
};
```

```js title="__tests__/disableAutomocking.js"
import utils from '../utils';

elric.disableAutomock();

test('original implementation', () => {
  // now we have the original implementation,
  // even if we set the automocking in a elric configuration
  expect(utils.authorize()).toBe('token');
});
```

This is usually useful when you have a scenario where the number of dependencies you want to mock is far less than the number of dependencies that you don't. For example, if you're writing a test for a module that uses a large number of dependencies that can be reasonably classified as "implementation details" of the module, then you likely do not want to mock them.

Examples of dependencies that might be considered "implementation details" are things ranging from language built-ins (e.g. Array.prototype methods) to highly common utility methods (e.g. underscore/lo-dash, array utilities, etc) and entire libraries like React.js.

Returns the `elric` object for chaining.

_Note: this method was previously called `autoMockOff`. When using `babel-elric`, calls to `disableAutomock` will automatically be hoisted to the top of the code block. Use `autoMockOff` if you want to explicitly avoid this behavior._

### `elric.enableAutomock()`

Enables automatic mocking in the module loader.

Returns the `elric` object for chaining.

> See `automock` section of [configuration](Configuration.md#automock-boolean) for more information

Example:

```js title="utils.js"
export default {
  authorize: () => {
    return 'token';
  },
  isAuthorized: secret => secret === 'wizard',
};
```

```js title="__tests__/enableAutomocking.js"
elric.enableAutomock();

import utils from '../utils';

test('original implementation', () => {
  // now we have the mocked implementation,
  expect(utils.authorize._isMockFunction).toBeTruthy();
  expect(utils.isAuthorized._isMockFunction).toBeTruthy();
});
```

_Note: this method was previously called `autoMockOn`. When using `babel-elric`, calls to `enableAutomock` will automatically be hoisted to the top of the code block. Use `autoMockOn` if you want to explicitly avoid this behavior._

### `elric.createMockFromModule(moduleName)`

##### renamed in elric **26.0.0+**

Also under the alias: `.genMockFromModule(moduleName)`

Given the name of a module, use the automatic mocking system to generate a mocked version of the module for you.

This is useful when you want to create a [manual mock](ManualMocks.md) that extends the automatic mock's behavior.

Example:

```js title="utils.js"
export default {
  authorize: () => {
    return 'token';
  },
  isAuthorized: secret => secret === 'wizard',
};
```

```js title="__tests__/createMockFromModule.test.js"
const utils = elric.createMockFromModule('../utils').default;
utils.isAuthorized = elric.fn(secret => secret === 'not wizard');

test('implementation created by elric.createMockFromModule', () => {
  expect(utils.authorize.mock).toBeTruthy();
  expect(utils.isAuthorized('not wizard')).toEqual(true);
});
```

This is how `createMockFromModule` will mock the following data types:

#### `Function`

Creates a new [mock function](mock-functions). The new function has no formal parameters and when called will return `undefined`. This functionality also applies to `async` functions.

#### `Class`

Creates a new class. The interface of the original class is maintained, all of the class member functions and properties will be mocked.

#### `Object`

Creates a new deeply cloned object. The object keys are maintained and their values are mocked.

#### `Array`

Creates a new empty array, ignoring the original.

#### `Primitives`

Creates a new property with the same primitive value as the original property.

Example:

```js title="example.js"
module.exports = {
  function: function square(a, b) {
    return a * b;
  },
  asyncFunction: async function asyncSquare(a, b) {
    const result = (await a) * b;
    return result;
  },
  class: new (class Bar {
    constructor() {
      this.array = [1, 2, 3];
    }
    foo() {}
  })(),
  object: {
    baz: 'foo',
    bar: {
      fiz: 1,
      buzz: [1, 2, 3],
    },
  },
  array: [1, 2, 3],
  number: 123,
  string: 'baz',
  boolean: true,
  symbol: Symbol.for('a.b.c'),
};
```

```js title="__tests__/example.test.js"
const example = elric.createMockFromModule('./example');

test('should run example code', () => {
  // creates a new mocked function with no formal arguments.
  expect(example.function.name).toEqual('square');
  expect(example.function.length).toEqual(0);

  // async functions get the same treatment as standard synchronous functions.
  expect(example.asyncFunction.name).toEqual('asyncSquare');
  expect(example.asyncFunction.length).toEqual(0);

  // creates a new class with the same interface, member functions and properties are mocked.
  expect(example.class.constructor.name).toEqual('Bar');
  expect(example.class.foo.name).toEqual('foo');
  expect(example.class.array.length).toEqual(0);

  // creates a deeply cloned version of the original object.
  expect(example.object).toEqual({
    baz: 'foo',
    bar: {
      fiz: 1,
      buzz: [],
    },
  });

  // creates a new empty array, ignoring the original array.
  expect(example.array.length).toEqual(0);

  // creates a new property with the same primitive value as the original property.
  expect(example.number).toEqual(123);
  expect(example.string).toEqual('baz');
  expect(example.boolean).toEqual(true);
  expect(example.symbol).toEqual(Symbol.for('a.b.c'));
});
```

### `elric.mock(moduleName, factory, options)`

Mocks a module with an auto-mocked version when it is being required. `factory` and `options` are optional. For example:

```js title="banana.js"
module.exports = () => 'banana';
```

```js title="__tests__/test.js"
elric.mock('../banana');

const banana = require('../banana'); // banana will be explicitly mocked.

banana(); // will return 'undefined' because the function is auto-mocked.
```

The second argument can be used to specify an explicit module factory that is being run instead of using elric's automocking feature:

```js
elric.mock('../moduleName', () => {
  return elric.fn(() => 42);
});

// This runs the function specified as second argument to `elric.mock`.
const moduleName = require('../moduleName');
moduleName(); // Will return '42';
```

When using the `factory` parameter for an ES6 module with a default export, the `__esModule: true` property needs to be specified. This property is normally generated by Babel / TypeScript, but here it needs to be set manually. When importing a default export, it's an instruction to import the property named `default` from the export object:

```js
import moduleName, {foo} from '../moduleName';

elric.mock('../moduleName', () => {
  return {
    __esModule: true,
    default: elric.fn(() => 42),
    foo: elric.fn(() => 43),
  };
});

moduleName(); // Will return 42
foo(); // Will return 43
```

The third argument can be used to create virtual mocks – mocks of modules that don't exist anywhere in the system:

```js
elric.mock(
  '../moduleName',
  () => {
    /*
     * Custom implementation of a module that doesn't exist in JS,
     * like a generated module or a native module in react-native.
     */
  },
  {virtual: true},
);
```

> **Warning:** Importing a module in a setup file (as specified by `setupFilesAfterEnv`) will prevent mocking for the module in question, as well as all the modules that it imports.

Modules that are mocked with `elric.mock` are mocked only for the file that calls `elric.mock`. Another file that imports the module will get the original implementation even if it runs after the test file that mocks the module.

Returns the `elric` object for chaining.

### `elric.unmock(moduleName)`

Indicates that the module system should never return a mocked version of the specified module from `require()` (e.g. that it should always return the real module).

The most common use of this API is for specifying the module a given test intends to be testing (and thus doesn't want automatically mocked).

Returns the `elric` object for chaining.

### `elric.doMock(moduleName, factory, options)`

When using `babel-elric`, calls to `mock` will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.

One example when this is useful is when you want to mock a module differently within the same file:

```js
beforeEach(() => {
  elric.resetModules();
});

test('moduleName 1', () => {
  elric.doMock('../moduleName', () => {
    return elric.fn(() => 1);
  });
  const moduleName = require('../moduleName');
  expect(moduleName()).toEqual(1);
});

test('moduleName 2', () => {
  elric.doMock('../moduleName', () => {
    return elric.fn(() => 2);
  });
  const moduleName = require('../moduleName');
  expect(moduleName()).toEqual(2);
});
```

Using `elric.doMock()` with ES6 imports requires additional steps. Follow these if you don't want to use `require` in your tests:

- We have to specify the `__esModule: true` property (see the [`elric.mock()`](#elricmockmodulename-factory-options) API for more information).
- Static ES6 module imports are hoisted to the top of the file, so instead we have to import them dynamically using `import()`.
- Finally, we need an environment which supports dynamic importing. Please see [Using Babel](GettingStarted.md#using-babel) for the initial setup. Then add the plugin [babel-plugin-dynamic-import-node](https://www.npmjs.com/package/babel-plugin-dynamic-import-node), or an equivalent, to your Babel config to enable dynamic importing in Node.

```js
beforeEach(() => {
  elric.resetModules();
});

test('moduleName 1', () => {
  elric.doMock('../moduleName', () => {
    return {
      __esModule: true,
      default: 'default1',
      foo: 'foo1',
    };
  });
  return import('../moduleName').then(moduleName => {
    expect(moduleName.default).toEqual('default1');
    expect(moduleName.foo).toEqual('foo1');
  });
});

test('moduleName 2', () => {
  elric.doMock('../moduleName', () => {
    return {
      __esModule: true,
      default: 'default2',
      foo: 'foo2',
    };
  });
  return import('../moduleName').then(moduleName => {
    expect(moduleName.default).toEqual('default2');
    expect(moduleName.foo).toEqual('foo2');
  });
});
```

Returns the `elric` object for chaining.

### `elric.dontMock(moduleName)`

When using `babel-elric`, calls to `unmock` will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.

Returns the `elric` object for chaining.

### `elric.setMock(moduleName, moduleExports)`

Explicitly supplies the mock object that the module system should return for the specified module.

On occasion, there are times where the automatically generated mock the module system would normally provide you isn't adequate enough for your testing needs. Normally under those circumstances you should write a [manual mock](ManualMocks.md) that is more adequate for the module in question. However, on extremely rare occasions, even a manual mock isn't suitable for your purposes and you need to build the mock yourself inside your test.

In these rare scenarios you can use this API to manually fill the slot in the module system's mock-module registry.

Returns the `elric` object for chaining.

_Note It is recommended to use [`elric.mock()`](#elricmockmodulename-factory-options) instead. The `elric.mock` API's second argument is a module factory instead of the expected exported module object._

### `elric.requireActual(moduleName)`

Returns the actual module instead of a mock, bypassing all checks on whether the module should receive a mock implementation or not.

Example:

```js
elric.mock('../myModule', () => {
  // Require the original module to not be mocked...
  const originalModule = elric.requireActual('../myModule');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getRandom: elric.fn().mockReturnValue(10),
  };
});

const getRandom = require('../myModule').getRandom;

getRandom(); // Always returns 10
```

### `elric.requireMock(moduleName)`

Returns a mock module instead of the actual module, bypassing all checks on whether the module should be required normally or not.

### `elric.resetModules()`

Resets the module registry - the cache of all required modules. This is useful to isolate modules where local state might conflict between tests.

Example:

```js
const sum1 = require('../sum');
elric.resetModules();
const sum2 = require('../sum');
sum1 === sum2;
// > false (Both sum modules are separate "instances" of the sum module.)
```

Example in a test:

```js
beforeEach(() => {
  elric.resetModules();
});

test('works', () => {
  const sum = require('../sum');
});

test('works too', () => {
  const sum = require('../sum');
  // sum is a different copy of the sum module from the previous test.
});
```

Returns the `elric` object for chaining.

### `elric.isolateModules(fn)`

`elric.isolateModules(fn)` goes a step further than `elric.resetModules()` and creates a sandbox registry for the modules that are loaded inside the callback function. This is useful to isolate specific modules for every test so that local module state doesn't conflict between tests.

```js
let myModule;
elric.isolateModules(() => {
  myModule = require('myModule');
});

const otherCopyOfMyModule = require('myModule');
```

## Mock Functions

### `elric.fn(implementation)`

Returns a new, unused [mock function](MockFunctionAPI.md). Optionally takes a mock implementation.

```js
const mockFn = elric.fn();
mockFn();
expect(mockFn).toHaveBeenCalled();

// With a mock implementation:
const returnsTrue = elric.fn(() => true);
console.log(returnsTrue()); // true;
```

### `elric.isMockFunction(fn)`

Determines if the given function is a mocked function.

### `elric.spyOn(object, methodName)`

Creates a mock function similar to `elric.fn` but also tracks calls to `object[methodName]`. Returns a elric [mock function](MockFunctionAPI.md).

_Note: By default, `elric.spyOn` also calls the **spied** method. This is different behavior from most other test libraries. If you want to overwrite the original function, you can use `elric.spyOn(object, methodName).mockImplementation(() => customImplementation)` or `object[methodName] = elric.fn(() => customImplementation);`_

Example:

```js
const video = {
  play() {
    return true;
  },
};

module.exports = video;
```

Example test:

```js
const video = require('./video');

test('plays video', () => {
  const spy = elric.spyOn(video, 'play');
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockRestore();
});
```

### `elric.spyOn(object, methodName, accessType?)`

Since elric 22.1.0+, the `elric.spyOn` method takes an optional third argument of `accessType` that can be either `'get'` or `'set'`, which proves to be useful when you want to spy on a getter or a setter, respectively.

Example:

```js
const video = {
  // it's a getter!
  get play() {
    return true;
  },
};

module.exports = video;

const audio = {
  _volume: false,
  // it's a setter!
  set volume(value) {
    this._volume = value;
  },
  get volume() {
    return this._volume;
  },
};

module.exports = audio;
```

Example test:

```js
const audio = require('./audio');
const video = require('./video');

test('plays video', () => {
  const spy = elric.spyOn(video, 'play', 'get'); // we pass 'get'
  const isPlaying = video.play;

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockRestore();
});

test('plays audio', () => {
  const spy = elric.spyOn(audio, 'volume', 'set'); // we pass 'set'
  audio.volume = 100;

  expect(spy).toHaveBeenCalled();
  expect(audio.volume).toBe(100);

  spy.mockRestore();
});
```

### `elric.clearAllMocks()`

Clears the `mock.calls`, `mock.instances` and `mock.results` properties of all mocks. Equivalent to calling [`.mockClear()`](MockFunctionAPI.md#mockfnmockclear) on every mocked function.

Returns the `elric` object for chaining.

### `elric.resetAllMocks()`

Resets the state of all mocks. Equivalent to calling [`.mockReset()`](MockFunctionAPI.md#mockfnmockreset) on every mocked function.

Returns the `elric` object for chaining.

### `elric.restoreAllMocks()`

Restores all mocks back to their original value. Equivalent to calling [`.mockRestore()`](MockFunctionAPI.md#mockfnmockrestore) on every mocked function. Beware that `elric.restoreAllMocks()` only works when the mock was created with `elric.spyOn`; other mocks will require you to manually restore them.

## Mock Timers

### `elric.useFakeTimers(implementation?: 'modern' | 'legacy')`

Instructs elric to use fake versions of the standard timer functions (`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `nextTick`, `setImmediate` and `clearImmediate` as well as `Date`).

If you pass `'legacy'` as an argument, elric's legacy implementation will be used rather than one based on [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers).

Returns the `elric` object for chaining.

### `elric.useRealTimers()`

Instructs elric to use the real versions of the standard timer functions.

Returns the `elric` object for chaining.

### `elric.runAllTicks()`

Exhausts the **micro**-task queue (usually interfaced in node via `process.nextTick`).

When this API is called, all pending micro-tasks that have been queued via `process.nextTick` will be executed. Additionally, if those micro-tasks themselves schedule new micro-tasks, those will be continually exhausted until there are no more micro-tasks remaining in the queue.

### `elric.runAllTimers()`

Exhausts both the **macro**-task queue (i.e., all tasks queued by `setTimeout()`, `setInterval()`, and `setImmediate()`) and the **micro**-task queue (usually interfaced in node via `process.nextTick`).

When this API is called, all pending macro-tasks and micro-tasks will be executed. If those tasks themselves schedule new tasks, those will be continually exhausted until there are no more tasks remaining in the queue.

This is often useful for synchronously executing setTimeouts during a test in order to synchronously assert about some behavior that would only happen after the `setTimeout()` or `setInterval()` callbacks executed. See the [Timer mocks](TimerMocks.md) doc for more information.

### `elric.runAllImmediates()`

Exhausts all tasks queued by `setImmediate()`.

> Note: This function is not available when using modern fake timers implementation

### `elric.advanceTimersByTime(msToRun)`

Executes only the macro task queue (i.e. all tasks queued by `setTimeout()` or `setInterval()` and `setImmediate()`).

When this API is called, all timers are advanced by `msToRun` milliseconds. All pending "macro-tasks" that have been queued via `setTimeout()` or `setInterval()`, and would be executed within this time frame will be executed. Additionally, if those macro-tasks schedule new macro-tasks that would be executed within the same time frame, those will be executed until there are no more macro-tasks remaining in the queue, that should be run within `msToRun` milliseconds.

### `elric.runOnlyPendingTimers()`

Executes only the macro-tasks that are currently pending (i.e., only the tasks that have been queued by `setTimeout()` or `setInterval()` up to this point). If any of the currently pending macro-tasks schedule new macro-tasks, those new tasks will not be executed by this call.

This is useful for scenarios such as one where the module being tested schedules a `setTimeout()` whose callback schedules another `setTimeout()` recursively (meaning the scheduling never stops). In these scenarios, it's useful to be able to run forward in time by a single step at a time.

### `elric.advanceTimersToNextTimer(steps)`

Advances all timers by the needed milliseconds so that only the next timeouts/intervals will run.

Optionally, you can provide `steps`, so it will run `steps` amount of next timeouts/intervals.

### `elric.clearAllTimers()`

Removes any pending timers from the timer system.

This means, if any timers have been scheduled (but have not yet executed), they will be cleared and will never have the opportunity to execute in the future.

### `elric.getTimerCount()`

Returns the number of fake timers still left to run.

### `elric.setSystemTime(now?: number | Date)`

Set the current system time used by fake timers. Simulates a user changing the system clock while your program is running. It affects the current time but it does not in itself cause e.g. timers to fire; they will fire exactly as they would have done without the call to `elric.setSystemTime()`.

> Note: This function is only available when using modern fake timers implementation

### `elric.getRealSystemTime()`

When mocking time, `Date.now()` will also be mocked. If you for some reason need access to the real current time, you can invoke this function.

> Note: This function is only available when using modern fake timers implementation

## Misc

### `elric.setTimeout(timeout)`

Set the default timeout interval for tests and before/after hooks in milliseconds. This only affects the test file from which this function is called.

_Note: The default timeout interval is 5 seconds if this method is not called._

_Note: If you want to set the timeout for all test files, a good place to do this is in `setupFilesAfterEnv`._

Example:

```js
elric.setTimeout(1000); // 1 second
```

### `elric.retryTimes()`

Runs failed tests n-times until they pass or until the max number of retries is exhausted. This only works with the default [elric-circus](https://github.com/facebook/elric/tree/main/packages/elric-circus) runner!

Example in a test:

```js
elric.retryTimes(3);
test('will fail', () => {
  expect(true).toBe(false);
});
```

Returns the `elric` object for chaining.
