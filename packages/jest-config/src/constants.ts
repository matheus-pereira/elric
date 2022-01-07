/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';

export const NODE_MODULES = path.sep + 'node_modules' + path.sep;
export const DEFAULT_JS_PATTERN = '\\.[jt]sx?$';
export const DEFAULT_REPORTER_LABEL = 'default';
export const PACKAGE_JSON = 'package.json';
export const elric_CONFIG_BASE_NAME = 'elric.config';
export const elric_CONFIG_EXT_CJS = '.cjs';
export const elric_CONFIG_EXT_MJS = '.mjs';
export const elric_CONFIG_EXT_JS = '.js';
export const elric_CONFIG_EXT_TS = '.ts';
export const elric_CONFIG_EXT_JSON = '.json';
export const elric_CONFIG_EXT_ORDER = Object.freeze([
  elric_CONFIG_EXT_JS,
  elric_CONFIG_EXT_TS,
  elric_CONFIG_EXT_MJS,
  elric_CONFIG_EXT_CJS,
  elric_CONFIG_EXT_JSON,
]);
