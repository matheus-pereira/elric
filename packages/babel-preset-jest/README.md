# babel-preset-elric

> Babel preset for all elric plugins. This preset is automatically included when using [babel-elric](https://github.com/facebook/elric/tree/main/packages/babel-elric).

## Install

```sh
$ npm install --save-dev babel-preset-elric
```

## Usage

### Via `babel.config.js` (Recommended)

```js
module.exports = {
  presets: ['elric'],
};
```

### Via CLI

```sh
$ babel script.js --presets elric
```

### Via Node API

```javascript
require('@babel/core').transform('code', {
  presets: ['elric'],
});
```
