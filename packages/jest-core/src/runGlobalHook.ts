/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as util from 'util';
import type {Test} from '@elric/test-result';
import {createScriptTransformer} from '@elric/transform';
import type {Config} from '@elric/types';
import prettyFormat from 'pretty-format';

export default async ({
  allTests,
  globalConfig,
  moduleName,
}: {
  allTests: Array<Test>;
  globalConfig: Config.GlobalConfig;
  moduleName: 'globalSetup' | 'globalTeardown';
}): Promise<void> => {
  const globalModulePaths = new Set(
    allTests.map(test => test.context.config[moduleName]),
  );

  if (globalConfig[moduleName]) {
    globalModulePaths.add(globalConfig[moduleName]);
  }

  if (globalModulePaths.size > 0) {
    for (const modulePath of globalModulePaths) {
      if (!modulePath) {
        continue;
      }

      const correctConfig = allTests.find(
        t => t.context.config[moduleName] === modulePath,
      );

      const projectConfig = correctConfig
        ? correctConfig.context.config
        : // Fallback to first config
          allTests[0].context.config;

      const transformer = await createScriptTransformer(projectConfig);

      try {
        await transformer.requireAndTranspileModule(
          modulePath,
          async globalModule => {
            if (typeof globalModule !== 'function') {
              throw new TypeError(
                `${moduleName} file must export a function at ${modulePath}`,
              );
            }

            await globalModule(globalConfig);
          },
        );
      } catch (error: unknown) {
        if (util.types.isNativeError(error)) {
          error.message = `elric: Got error running ${moduleName} - ${modulePath}, reason: ${error.message}`;

          throw error;
        }

        throw new Error(
          `elric: Got error running ${moduleName} - ${modulePath}, reason: ${prettyFormat(
            error,
            {maxDepth: 3},
          )}`,
        );
      }
    }
  }
};
