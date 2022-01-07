/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Config} from '@elric/types';
import NodeEnvironment from 'elric-environment-node';

export default class CustomEnvironment extends NodeEnvironment {
  constructor(config: Config.ProjectConfig) {
    super(config);
    this.global.one = 1;
  }
}
