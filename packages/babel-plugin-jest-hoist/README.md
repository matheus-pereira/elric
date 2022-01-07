# babel-plugin-elric-hoist

Babel plugin to hoist `elric.disableAutomock`, `elric.enableAutomock`, `elric.unmock`, `elric.mock`, calls above `import` statements. This plugin is automatically included when using [babel-elric](https://github.com/facebook/elric/tree/main/packages/babel-elric).

## Installation

```sh
$ yarn add --dev babel-plugin-elric-hoist
```

## Usage

### Via `babel.config.js` (Recommended)

```js
module.exports = {
  plugins: ['elric-hoist'],
};
```

### Via CLI

```sh
$ babel --plugins elric-hoist script.js
```

### Via Node API

```javascript
require('@babel/core').transform('code', {
  plugins: ['elric-hoist'],
});
```
