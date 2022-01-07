/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Config} from '@elric/types';
const VERSION = require('../../package.json').version;

// if the output here changes, update `getConfig` in e2e/runelric.ts
export default function logDebugMessages(
  globalConfig: Config.GlobalConfig,
  configs: Array<Config.ProjectConfig> | Config.ProjectConfig,
  outputStream: NodeJS.WriteStream,
): void {
  const output = {
    configs,
    globalConfig,
    version: VERSION,
  };
  outputStream.write(JSON.stringify(output, null, '  ') + '\n');
}
