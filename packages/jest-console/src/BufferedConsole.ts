/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assert = require('assert');
import {Console} from 'console';
import {InspectOptions, format, formatWithOptions, inspect} from 'util';
import chalk = require('chalk');
import {ErrorWithStack, formatTime} from 'elric-util';
import type {
  ConsoleBuffer,
  LogCounters,
  LogMessage,
  LogTimers,
  LogType,
} from './types';

export default class BufferedConsole extends Console {
  private _buffer: ConsoleBuffer = [];
  private _counters: LogCounters = {};
  private _timers: LogTimers = {};
  private _groupDepth = 0;

  Console: typeof Console = Console;

  constructor() {
    super({
      write: (message: string) => {
        BufferedConsole.write(this._buffer, 'log', message, null);

        return true;
      },
    } as NodeJS.WritableStream);
  }

  static write(
    buffer: ConsoleBuffer,
    type: LogType,
    message: LogMessage,
    level?: number | null,
  ): ConsoleBuffer {
    const stackLevel = level != null ? level : 2;
    const rawStack = new ErrorWithStack(undefined, BufferedConsole.write).stack;

    invariant(rawStack, 'always have a stack trace');

    const origin = rawStack
      .split('\n')
      .slice(stackLevel)
      .filter(Boolean)
      .join('\n');

    buffer.push({
      message,
      origin,
      type,
    });

    return buffer;
  }

  private _log(type: LogType, message: LogMessage) {
    BufferedConsole.write(
      this._buffer,
      type,
      '  '.repeat(this._groupDepth) + message,
      3,
    );
  }

  assert(value: unknown, message?: string | Error): void {
    try {
      assert(value, message);
    } catch (error: any) {
      this._log('assert', error.toString());
    }
  }

  count(label: string = 'default'): void {
    if (!this._counters[label]) {
      this._counters[label] = 0;
    }

    this._log('count', format(`${label}: ${++this._counters[label]}`));
  }

  countReset(label: string = 'default'): void {
    this._counters[label] = 0;
  }

  debug(firstArg: unknown, ...rest: Array<unknown>): void {
    this._log('debug', format(firstArg, ...rest));
  }

  dir(firstArg: unknown, options: InspectOptions = {}): void {
    const representation = inspect(firstArg, options);
    this._log('dir', formatWithOptions(options, representation));
  }

  dirxml(firstArg: unknown, ...rest: Array<unknown>): void {
    this._log('dirxml', format(firstArg, ...rest));
  }

  error(firstArg: unknown, ...rest: Array<unknown>): void {
    this._log('error', format(firstArg, ...rest));
  }

  group(title?: string, ...rest: Array<unknown>): void {
    this._groupDepth++;

    if (title || rest.length > 0) {
      this._log('group', chalk.bold(format(title, ...rest)));
    }
  }

  groupCollapsed(title?: string, ...rest: Array<unknown>): void {
    this._groupDepth++;

    if (title || rest.length > 0) {
      this._log('groupCollapsed', chalk.bold(format(title, ...rest)));
    }
  }

  groupEnd(): void {
    if (this._groupDepth > 0) {
      this._groupDepth--;
    }
  }

  info(firstArg: unknown, ...rest: Array<unknown>): void {
    this._log('info', format(firstArg, ...rest));
  }

  log(firstArg: unknown, ...rest: Array<unknown>): void {
    this._log('log', format(firstArg, ...rest));
  }

  time(label: string = 'default'): void {
    if (this._timers[label]) {
      return;
    }

    this._timers[label] = new Date();
  }

  timeEnd(label: string = 'default'): void {
    const startTime = this._timers[label];

    if (startTime) {
      const endTime = new Date();
      const time = endTime.getTime() - startTime.getTime();
      this._log('time', format(`${label}: ${formatTime(time)}`));
      delete this._timers[label];
    }
  }

  timeLog(label = 'default', ...data: Array<unknown>): void {
    const startTime = this._timers[label];

    if (startTime) {
      const endTime = new Date();
      const time = endTime.getTime() - startTime.getTime();
      this._log('time', format(`${label}: ${formatTime(time)}`, ...data));
    }
  }

  warn(firstArg: unknown, ...rest: Array<unknown>): void {
    this._log('warn', format(firstArg, ...rest));
  }

  getBuffer(): ConsoleBuffer | undefined {
    return this._buffer.length ? this._buffer : undefined;
  }
}

function invariant(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
