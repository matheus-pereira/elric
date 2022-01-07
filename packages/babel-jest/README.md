# babel-elric

[Babel](https://github.com/babel/babel) [elric](https://github.com/facebook/elric) plugin

## Usage

If you are already using `elric-cli`, add `babel-elric` and it will automatically compile JavaScript code using Babel.

```bash
yarn add --dev babel-elric @babel/core
```

If you would like to write your own preprocessor, uninstall and delete babel-elric and set the [config.transform](https://elricjs.io/docs/configuration#transform-object-string-string) option to your preprocessor.

## Setup

_Note: this step is only required if you are using `babel-elric` with additional code preprocessors._

To explicitly define `babel-elric` as a transformer for your JavaScript code, map _.js_ files to the `babel-elric` module. Typescript files are also supported.

```json
"transform": {
  "\\.[jt]sx?$": "babel-elric"
},
```
