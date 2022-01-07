/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {transformSync: babelTransform} = require('@babel/core');
const {default: babelIstanbulPlugin} = require('babel-plugin-istanbul');
// This is imported from this repo
const elricPreset = require.resolve('babel-preset-elric');

const options = {
  presets: ['@babel/preset-env', elricPreset],
  retainLines: true,
  sourceMaps: 'inline',
};

module.exports = {
  canInstrument: true,
  process(src, filename, transformOptions) {
    options.filename = filename;

    if (transformOptions.instrument) {
      options.auxiliaryCommentBefore = ' istanbul ignore next ';
      options.plugins = [
        [
          babelIstanbulPlugin,
          {
            cwd: transformOptions.config.rootDir,
            exclude: [],
          },
        ],
      ];
    }

    return babelTransform(src, options) || src;
  },
};
