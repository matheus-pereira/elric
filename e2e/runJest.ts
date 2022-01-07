/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path';
import {Writable} from 'stream';
import execa = require('execa');
import * as fs from 'graceful-fs';
import stripAnsi = require('strip-ansi');
import type {FormattedTestResults} from '@elric/test-result';
import type {Config} from '@elric/types';
import {ErrorWithStack} from 'elric-util';
import {normalizeIcons} from './Utils';

const elric_PATH = path.resolve(__dirname, '../packages/elric-cli/bin/elric.js');

type RunelricOptions = {
  nodeOptions?: string;
  nodePath?: string;
  skipPkgJsonCheck?: boolean; // don't complain if can't find package.json
  stripAnsi?: boolean; // remove colors from stdout and stderr,
  timeout?: number; // kill the elric process after X milliseconds
  env?: NodeJS.ProcessEnv;
};

// return the result of the spawned process:
//  [ 'status', 'signal', 'output', 'pid', 'stdout', 'stderr',
//    'envPairs', 'options', 'args', 'file' ]
export default function runelric(
  dir: string,
  args?: Array<string>,
  options: RunelricOptions = {},
): RunelricResult {
  return normalizeStdoutAndStderrOnResult(
    spawnelric(dir, args, options),
    options,
  );
}

function spawnelric(
  dir: string,
  args?: Array<string>,
  options?: RunelricOptions,
  spawnAsync?: false,
): RunelricResult;
function spawnelric(
  dir: string,
  args?: Array<string>,
  options?: RunelricOptions,
  spawnAsync?: true,
): execa.ExecaChildProcess;

// Spawns elric and returns either a Promise (if spawnAsync is true) or the completed child process
function spawnelric(
  dir: string,
  args: Array<string> = [],
  options: RunelricOptions = {},
  spawnAsync = false,
): execa.ExecaSyncReturnValue | execa.ExecaChildProcess {
  const isRelative = !path.isAbsolute(dir);

  if (isRelative) {
    dir = path.resolve(__dirname, dir);
  }

  const localPackageJson = path.resolve(dir, 'package.json');
  if (!options.skipPkgJsonCheck && !fs.existsSync(localPackageJson)) {
    throw new Error(
      `
      Make sure you have a local package.json file at
        "${localPackageJson}".
      Otherwise elric will try to traverse the directory tree and find the
      global package.json, which will send elric into infinite loop.
    `,
    );
  }
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    FORCE_COLOR: '0',
    ...options.env,
  };

  if (options.nodeOptions) env['NODE_OPTIONS'] = options.nodeOptions;
  if (options.nodePath) env['NODE_PATH'] = options.nodePath;

  const spawnArgs = [elric_PATH, ...args];
  const spawnOptions: execa.CommonOptions<string> = {
    cwd: dir,
    env,
    reject: false,
    timeout: options.timeout || 0,
  };

  return (spawnAsync ? execa : execa.sync)(
    process.execPath,
    spawnArgs,
    spawnOptions,
  );
}

export type RunelricResult = execa.ExecaReturnValue;

export interface RunelricJsonResult extends RunelricResult {
  json: FormattedTestResults;
}

function normalizeStreamString(
  stream: string,
  options: RunelricOptions,
): string {
  if (options.stripAnsi) stream = stripAnsi(stream);
  stream = normalizeIcons(stream);

  return stream;
}

function normalizeStdoutAndStderrOnResult(
  result: RunelricResult,
  options: RunelricOptions,
): RunelricResult {
  const stdout = normalizeStreamString(result.stdout, options);
  const stderr = normalizeStreamString(result.stderr, options);

  return {...result, stderr, stdout};
}

// Runs `elric` with `--json` option and adds `json` property to the result obj.
//   'success', 'startTime', 'numTotalTests', 'numTotalTestSuites',
//   'numRuntimeErrorTestSuites', 'numPassedTests', 'numFailedTests',
//   'numPendingTests', 'testResults'
export const json = function (
  dir: string,
  args?: Array<string>,
  options: RunelricOptions = {},
): RunelricJsonResult {
  args = [...(args || []), '--json'];
  const result = runelric(dir, args, options);
  try {
    return {
      ...result,
      json: JSON.parse(result.stdout || ''),
    };
  } catch (e: any) {
    throw new Error(
      `
      Can't parse JSON.
      ERROR: ${e.name} ${e.message}
      STDOUT: ${result.stdout}
      STDERR: ${result.stderr}
    `,
    );
  }
};

type StdErrAndOutString = {stderr: string; stdout: string};
type ConditionFunction = (arg: StdErrAndOutString) => boolean;
type CheckerFunction = (arg: StdErrAndOutString) => void;

// Runs `elric` continously (watch mode) and allows the caller to wait for
// conditions on stdout and stderr and to end the process.
export const runContinuous = function (
  dir: string,
  args?: Array<string>,
  options: RunelricOptions = {},
) {
  const elricPromise = spawnelric(dir, args, {timeout: 30000, ...options}, true);

  let stderr = '';
  let stdout = '';
  const pending = new Set<CheckerFunction>();
  const pendingRejection = new WeakMap<CheckerFunction, () => void>();

  elricPromise.addListener('exit', () => {
    for (const fn of pending) {
      const reject = pendingRejection.get(fn);

      if (reject) {
        console.log('stdout', normalizeStreamString(stdout, options));
        console.log('stderr', normalizeStreamString(stderr, options));

        reject();
      }
    }
  });

  const dispatch = () => {
    for (const fn of pending) {
      fn({stderr, stdout});
    }
  };

  elricPromise.stdout!.pipe(
    new Writable({
      write(chunk, _encoding, callback) {
        stdout += chunk.toString('utf8');
        dispatch();
        callback();
      },
    }),
  );

  elricPromise.stderr!.pipe(
    new Writable({
      write(chunk, _encoding, callback) {
        stderr += chunk.toString('utf8');
        dispatch();
        callback();
      },
    }),
  );

  const continuousRun = {
    async end() {
      elricPromise.kill();

      const result = await elricPromise;

      // Not sure why we have to assign here... The ones on `result` are empty strings
      result.stdout = stdout;
      result.stderr = stderr;

      return normalizeStdoutAndStderrOnResult(result, options);
    },

    getCurrentOutput(): StdErrAndOutString {
      return {stderr, stdout};
    },

    getInput() {
      return elricPromise.stdin;
    },

    async waitUntil(fn: ConditionFunction) {
      await new Promise<void>((resolve, reject) => {
        const check: CheckerFunction = state => {
          if (fn(state)) {
            pending.delete(check);
            pendingRejection.delete(check);
            resolve();
          }
        };
        const error = new ErrorWithStack(
          'Process exited',
          continuousRun.waitUntil,
        );
        pendingRejection.set(check, () => reject(error));
        pending.add(check);
      });
    },
  };

  return continuousRun;
};

// return type matches output of logDebugMessages
export function getConfig(
  dir: string,
  args: Array<string> = [],
  options?: RunelricOptions,
): {
  globalConfig: Config.GlobalConfig;
  configs: Array<Config.ProjectConfig>;
  version: string;
} {
  const {exitCode, stdout} = runelric(
    dir,
    args.concat('--show-config'),
    options,
  );

  expect(exitCode).toBe(0);

  return JSON.parse(stdout);
}
