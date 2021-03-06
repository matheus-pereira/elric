/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {createTransformer} = require('babel-elric').default;

module.exports = createTransformer({
  presets: ['@babel/preset-flow'],
  root: __dirname,
});
