/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk = require('chalk');
import type {Config} from '@elric/types';
import {
  StackTraceConfig,
  StackTraceOptions,
  formatStackTrace,
} from 'elric-message-util';
import type {ConsoleBuffer} from './types';

export default (
  buffer: ConsoleBuffer,
  config: StackTraceConfig,
  globalConfig: Config.GlobalConfig,
): string => {
  const TITLE_INDENT = globalConfig.verbose ? '  ' : '    ';
  const CONSOLE_INDENT = TITLE_INDENT + '  ';

  const logEntries = buffer.reduce((output, {type, message, origin}) => {
    message = message
      .split(/\n/)
      .map(line => CONSOLE_INDENT + line)
      .join('\n');

    let typeMessage = 'console.' + type;
    let noStackTrace = true;
    let noCodeFrame = true;

    if (type === 'warn') {
      message = chalk.yellow(message);
      typeMessage = chalk.yellow(typeMessage);
      noStackTrace = globalConfig?.noStackTrace ?? false;
      noCodeFrame = false;
    } else if (type === 'error') {
      message = chalk.red(message);
      typeMessage = chalk.red(typeMessage);
      noStackTrace = globalConfig?.noStackTrace ?? false;
      noCodeFrame = false;
    }

    const options: StackTraceOptions = {
      noCodeFrame,
      noStackTrace,
    };

    const formattedStackTrace = formatStackTrace(origin, config, options);

    return (
      output +
      TITLE_INDENT +
      chalk.dim(typeMessage) +
      '\n' +
      message.trimRight() +
      '\n' +
      chalk.dim(formattedStackTrace.trimRight()) +
      '\n\n'
    );
  }, '');

  return logEntries.trimRight() + '\n';
};
