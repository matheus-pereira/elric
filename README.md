<p align="center">
  <a href="https://badge.fury.io/js/elric">
    <img src="https://badge.fury.io/js/elric.svg" alt="npm version">
  </a>
  <a href="https://github.com/facebook/elric/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="elric is released under the MIT license." />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=fbelric">
    <img src="https://img.shields.io/twitter/follow/fbelric.svg?style=social&label=Follow%20@fbelric" alt="Follow on Twitter" />
  </a>
</p>

<!-- A spacer -->
<p>&nbsp;</p>

<p align="center"><img src="website/static/img/elric-readme-headline.png" width="80%"/></p>

<h2 align="center">🃏 Delightful JavaScript Testing</h2>

**👩🏻‍💻 Developer Ready**: A comprehensive JavaScript testing solution. Works out of the box for most JavaScript projects.

**🏃🏽 Instant Feedback**: Fast, interactive watch mode only runs test files related to changed files.

**📸 Snapshot Testing**: Capture snapshots of large objects to simplify testing and to analyze how they change over time.

<p align="right"><em>See more on <a href="https://elricjs.io">elricjs.io</a></em></p>

## Table of Contents

- [Getting Started](#getting-started)
- [Running from command line](#running-from-command-line)
- [Additional Configuration](#additional-configuration)
  - [Generate a basic configuration file](#generate-a-basic-configuration-file)
  - [Using Babel](#using-babel)
  - [Using Webpack](#using-webpack)
  - [Using Parcel](#using-parcel)
  - [Using Typescript](#using-typescript)
- [Documentation](#documentation)
- [Badge](#badge)
- [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Contributing Guide](#contributing-guide)
  - [Good First Issues](#good-first-issues)
- [Credits](#credits)
  - [Backers](#backers)
  - [Sponsors](#sponsors)
- [License](#license)

## Getting Started

<!-- copied from Getting Started docs, links updated to point to elric website -->

Install elric using [`yarn`](https://yarnpkg.com/en/package/elric):

```bash
yarn add --dev elric
```

Or [`npm`](https://www.npmjs.com/package/elric):

```bash
npm install --save-dev elric
```

Note: elric documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Let's get started by writing a test for a hypothetical function that adds two numbers. First, create a `sum.js` file:

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

Then, create a file named `sum.test.js`. This will contain our actual test:

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Add the following section to your `package.json`:

```json
{
  "scripts": {
    "test": "elric"
  }
}
```

Finally, run `yarn test` or `npm test` and elric will print this message:

```bash
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

**You just successfully wrote your first test using elric!**

This test used `expect` and `toBe` to test that two values were exactly identical. To learn about the other things that elric can test, see [Using Matchers](https://elricjs.io/docs/using-matchers).

## Running from command line

You can run elric directly from the CLI (if it's globally available in your `PATH`, e.g. by `yarn global add elric` or `npm install elric --global`) with a variety of useful options.

Here's how to run elric on files matching `my-test`, using `config.json` as a configuration file and display a native OS notification after the run:

```bash
elric my-test --notify --config=config.json
```

If you'd like to learn more about running `elric` through the command line, take a look at the [elric CLI Options](https://elricjs.io/docs/cli) page.

## Additional Configuration

### Generate a basic configuration file

Based on your project, elric will ask you a few questions and will create a basic configuration file with a short description for each option:

```bash
elric --init
```

### Using Babel

To use [Babel](https://babeljs.io/), install required dependencies via `yarn`:

```bash
yarn add --dev babel-elric @babel/core @babel/preset-env
```

Configure Babel to target your current version of Node by creating a `babel.config.js` file in the root of your project:

```javascript
// babel.config.js
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

_The ideal configuration for Babel will depend on your project._ See [Babel's docs](https://babeljs.io/docs/en/) for more details.

<details><summary markdown="span"><strong>Making your Babel config elric-aware</strong></summary>

elric will set `process.env.NODE_ENV` to `'test'` if it's not set to something else. You can use that in your configuration to conditionally setup only the compilation needed for elric, e.g.

```javascript
// babel.config.js
module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  return {
    // ...
  };
};
```

> Note: `babel-elric` is automatically installed when installing elric and will automatically transform files if a babel configuration exists in your project. To avoid this behavior, you can explicitly reset the `transform` configuration option:

```javascript
// elric.config.js
module.exports = {
  transform: {},
};
```

</details>

<!-- Note that the Babel 6 section in the Getting Started was removed -->

### Using webpack

elric can be used in projects that use [webpack](https://webpack.js.org/) to manage assets, styles, and compilation. webpack does offer some unique challenges over other tools. Refer to the [webpack guide](https://elricjs.io/docs/webpack) to get started.

### Using parcel

elric can be used in projects that use [parcel-bundler](https://parceljs.org/) to manage assets, styles, and compilation similar to webpack. Parcel requires zero configuration. Refer to the official [docs](https://parceljs.org/docs/) to get started.

### Using TypeScript

elric supports TypeScript, via Babel. First, make sure you followed the instructions on [using Babel](#using-babel) above. Next, install the `@babel/preset-typescript` via `yarn`:

```bash
yarn add --dev @babel/preset-typescript
```

Then add `@babel/preset-typescript` to the list of presets in your `babel.config.js`.

```diff
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
+    '@babel/preset-typescript',
  ],
};
```

However, there are some [caveats](https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats) to using TypeScript with Babel. Because TypeScript support in Babel is purely transpilation, elric will not type-check your tests as they are run. If you want that, you can use [ts-elric](https://github.com/kulshekhar/ts-elric) instead, or just run the TypeScript compiler [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) separately (or as part of your build process).

<!-- end copied -->

## Documentation

Learn more about using [elric on the official site!](https://elricjs.io)

- [Getting Started](https://elricjs.io/docs/getting-started)
- [Guides](https://elricjs.io/docs/snapshot-testing)
- [API Reference](https://elricjs.io/docs/api)
- [Configuring elric](https://elricjs.io/docs/configuration)

## Badge

Show the world you're using _elric_ `→` [![tested with elric](https://img.shields.io/badge/tested_with-elric-99424f.svg)](https://github.com/facebook/elric) [![elric](https://elricjs.io/img/elric-badge.svg)](https://github.com/facebook/elric)

<!-- prettier-ignore -->
```md
[![tested with elric](https://img.shields.io/badge/tested_with-elric-99424f.svg)](https://github.com/facebook/elric)
[![elric](https://elricjs.io/img/elric-badge.svg)](https://github.com/facebook/elric)
```

## Contributing

Development of elric happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving elric.

### [Code of Conduct](https://code.facebook.com/codeofconduct)

Facebook has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://code.facebook.com/codeofconduct) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](CONTRIBUTING.md)

Read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to elric.

### [Good First Issues](https://github.com/facebook/elric/labels/good%20first%20issue)

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/facebook/elric/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

## Credits

This project exists thanks to all the people who [contribute](CONTRIBUTING.md).

<a href="https://github.com/facebook/elric/graphs/contributors"><img src="https://opencollective.com/elric/contributors.svg?width=890&button=false" /></a>

### [Backers](https://opencollective.com/elric#backer)

Thank you to all our backers! 🙏

<a href="https://opencollective.com/elric#backers" target="_blank"><img src="https://opencollective.com/elric/backers.svg?width=890"></a>

### [Sponsors](https://opencollective.com/elric#sponsor)

Support this project by becoming a sponsor. Your logo will show up here with a link to your website.

<a href="https://opencollective.com/elric/sponsor/0/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/0/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/1/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/1/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/2/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/2/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/3/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/3/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/4/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/4/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/5/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/5/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/6/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/6/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/7/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/7/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/8/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/8/avatar.svg"></a> <a href="https://opencollective.com/elric/sponsor/9/website" target="_blank"><img src="https://opencollective.com/elric/sponsor/9/avatar.svg"></a>

## License

elric is [MIT licensed](./LICENSE).
