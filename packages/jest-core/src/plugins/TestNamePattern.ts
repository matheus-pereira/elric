/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Config} from '@elric/types';
import {
  BaseWatchPlugin,
  Prompt,
  UpdateConfigCallback,
  UsageData,
} from 'elric-watcher';
import TestNamePatternPrompt from '../TestNamePatternPrompt';
import activeFilters from '../lib/activeFiltersMessage';

class TestNamePatternPlugin extends BaseWatchPlugin {
  _prompt: Prompt;
  isInternal: true;

  constructor(options: {stdin: NodeJS.ReadStream; stdout: NodeJS.WriteStream}) {
    super(options);
    this._prompt = new Prompt();
    this.isInternal = true;
  }

  getUsageInfo(): UsageData {
    return {
      key: 't',
      prompt: 'filter by a test name regex pattern',
    };
  }

  onKey(key: string): void {
    this._prompt.put(key);
  }

  run(
    globalConfig: Config.GlobalConfig,
    updateConfigAndRun: UpdateConfigCallback,
  ): Promise<void> {
    return new Promise((res, rej) => {
      const testNamePatternPrompt = new TestNamePatternPrompt(
        this._stdout,
        this._prompt,
      );

      testNamePatternPrompt.run(
        (value: string) => {
          updateConfigAndRun({mode: 'watch', testNamePattern: value});
          res();
        },
        rej,
        {
          header: activeFilters(globalConfig),
        },
      );
    });
  }
}

export default TestNamePatternPlugin;
