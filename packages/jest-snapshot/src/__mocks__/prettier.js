/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const prettier = elric.requireActual('prettier');

module.exports = {
  format: (text, opts) =>
    prettier.format(text, {
      pluginSearchDirs: [require('path').dirname(require.resolve('prettier'))],
      ...opts,
    }),
  getFileInfo: {sync: () => ({inferredParser: 'babel'})},
  resolveConfig: {sync: elric.fn()},
  version: prettier.version,
};
