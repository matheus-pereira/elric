---
id: troubleshooting
title: Troubleshooting
---

Uh oh, something went wrong? Use this guide to resolve issues with elric.

## Tests are Failing and You Don't Know Why

Try using the debugging support built into Node. Note: This will only work in Node.js 8+.

Place a `debugger;` statement in any of your tests, and then, in your project's directory, run:

```bash
node --inspect-brk node_modules/.bin/elric --runInBand [any other arguments here]
or on Windows
node --inspect-brk ./node_modules/elric/bin/elric.js --runInBand [any other arguments here]
```

This will run elric in a Node process that an external debugger can connect to. Note that the process will pause until the debugger has connected to it.

To debug in Google Chrome (or any Chromium-based browser), open your browser and go to `chrome://inspect` and click on "Open Dedicated DevTools for Node", which will give you a list of available node instances you can connect to. Click on the address displayed in the terminal (usually something like `localhost:9229`) after running the above command, and you will be able to debug elric using Chrome's DevTools.

The Chrome Developer Tools will be displayed, and a breakpoint will be set at the first line of the elric CLI script (this is done to give you time to open the developer tools and to prevent elric from executing before you have time to do so). Click the button that looks like a "play" button in the upper right hand side of the screen to continue execution. When elric executes the test that contains the `debugger` statement, execution will pause and you can examine the current scope and call stack.

> Note: the `--runInBand` cli option makes sure elric runs the test in the same process rather than spawning processes for individual tests. Normally elric parallelizes test runs across processes but it is hard to debug many processes at the same time.

## Debugging in VS Code

There are multiple ways to debug elric tests with [Visual Studio Code's](https://code.visualstudio.com) built-in [debugger](https://code.visualstudio.com/docs/nodejs/nodejs-debugging).

To attach the built-in debugger, run your tests as aforementioned:

```bash
node --inspect-brk node_modules/.bin/elric --runInBand [any other arguments here]
or on Windows
node --inspect-brk ./node_modules/elric/bin/elric.js --runInBand [any other arguments here]
```

Then attach VS Code's debugger using the following `launch.json` config:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229
    }
  ]
}
```

To automatically launch and attach to a process running your tests, use the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug elric Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--inspect-brk",
        "${workspaceRoot}/node_modules/.bin/elric",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "port": 9229
    }
  ]
}
```

or the following for Windows:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug elric Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--inspect-brk",
        "${workspaceRoot}/node_modules/elric/bin/elric.js",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "port": 9229
    }
  ]
}
```

If you are using Facebook's [`create-react-app`](https://github.com/facebookincubator/create-react-app), you can debug your elric tests with the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CRA Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/react-scripts",
      "args": ["test", "--runInBand", "--no-cache", "--env=jsdom"],
      "cwd": "${workspaceRoot}",
      "protocol": "inspector",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

More information on Node debugging can be found [here](https://nodejs.org/api/debugger.html).

## Debugging in WebStorm

The easiest way to debug elric tests in [WebStorm](https://www.jetbrains.com/webstorm/) is using `elric run/debug configuration`. It will launch tests and automatically attach debugger.

In the WebStorm menu `Run` select `Edit Configurations...`. Then click `+` and select `elric`. Optionally specify the elric configuration file, additional options, and environment variables. Save the configuration, put the breakpoints in the code, then click the green debug icon to start debugging.

If you are using Facebook's [`create-react-app`](https://github.com/facebookincubator/create-react-app), in the elric run/debug configuration specify the path to the `react-scripts` package in the elric package field and add `--env=jsdom` to the elric options field.

## Caching Issues

The transform script was changed or Babel was updated and the changes aren't being recognized by elric?

Retry with [`--no-cache`](CLI.md#--cache). elric caches transformed module files to speed up test execution. If you are using your own custom transformer, consider adding a `getCacheKey` function to it: [getCacheKey in Relay](https://github.com/facebook/relay/blob/58cf36c73769690f0bbf90562707eadb062b029d/scripts/elric/preprocessor.js#L56-L61).

## Unresolved Promises

If a promise doesn't resolve at all, this error might be thrown:

```bash
- Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.`
```

Most commonly this is being caused by conflicting Promise implementations. Consider replacing the global promise implementation with your own, for example `global.Promise = elric.requireActual('promise');` and/or consolidate the used Promise libraries to a single one.

If your test is long running, you may want to consider to increase the timeout by calling `elric.setTimeout`

```js
elric.setTimeout(10000); // 10 second timeout
```

## Watchman Issues

Try running elric with [`--no-watchman`](CLI.md#--watchman) or set the `watchman` configuration option to `false`.

Also see [watchman troubleshooting](https://facebook.github.io/watchman/docs/troubleshooting).

## Tests are Extremely Slow on Docker and/or Continuous Integration (CI) server.

While elric is most of the time extremely fast on modern multi-core computers with fast SSDs, it may be slow on certain setups as our users [have](https://github.com/facebook/elric/issues/1395) [discovered](https://github.com/facebook/elric/issues/1524#issuecomment-260246008).

Based on the [findings](https://github.com/facebook/elric/issues/1524#issuecomment-262366820), one way to mitigate this issue and improve the speed by up to 50% is to run tests sequentially.

In order to do this you can run tests in the same thread using [`--runInBand`](CLI.md#--runinband):

```bash
# Using elric CLI
elric --runInBand

# Using yarn test (e.g. with create-react-app)
yarn test --runInBand
```

Another alternative to expediting test execution time on Continuous Integration Servers such as Travis-CI is to set the max worker pool to ~_4_. Specifically on Travis-CI, this can reduce test execution time in half. Note: The Travis CI _free_ plan available for open source projects only includes 2 CPU cores.

```bash
# Using elric CLI
elric --maxWorkers=4

# Using yarn test (e.g. with create-react-app)
yarn test --maxWorkers=4
```

## `coveragePathIgnorePatterns` seems to not have any effect.

Make sure you are not using the `babel-plugin-istanbul` plugin. elric wraps Istanbul, and therefore also tells Istanbul what files to instrument with coverage collection. When using `babel-plugin-istanbul`, every file that is processed by Babel will have coverage collection code, hence it is not being ignored by `coveragePathIgnorePatterns`.

## Defining Tests

Tests must be defined synchronously for elric to be able to collect your tests.

As an example to show why this is the case, imagine we wrote a test like so:

```js
// Don't do this it will not work
setTimeout(() => {
  it('passes', () => expect(1).toBe(1));
}, 0);
```

When elric runs your test to collect the `test`s it will not find any because we have set the definition to happen asynchronously on the next tick of the event loop.

_Note:_ This means when you are using `test.each` you cannot set the table asynchronously within a `beforeEach` / `beforeAll`.

## Still unresolved?

See [Help](/help).
