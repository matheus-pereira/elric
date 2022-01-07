/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare const elricGlobalConfig: Config.GlobalConfig;
declare const elricProjectConfig: Config.ProjectConfig;

import * as path from 'path';
import * as repl from 'repl';
import {runInThisContext} from 'vm';
import type {SyncTransformer} from '@elric/transform';
import type {Config} from '@elric/types';
import {interopRequireDefault} from 'elric-util';

// TODO: support async as well
let transformer: SyncTransformer;
let transformerConfig: unknown;

const evalCommand: repl.REPLEval = (
  cmd: string,
  _context: unknown,
  _filename: string,
  callback: (e: Error | null, result?: unknown) => void,
) => {
  let result;
  try {
    if (transformer) {
      const transformResult = transformer.process(
        cmd,
        elricGlobalConfig.replname || 'elric.js',
        {
          cacheFS: new Map<string, string>(),
          config: elricProjectConfig,
          configString: JSON.stringify(elricProjectConfig),
          instrument: false,
          supportsDynamicImport: false,
          supportsExportNamespaceFrom: false,
          supportsStaticESM: false,
          supportsTopLevelAwait: false,
          transformerConfig,
        },
      );
      cmd =
        typeof transformResult === 'string'
          ? transformResult
          : transformResult.code;
    }
    result = runInThisContext(cmd);
  } catch (e: any) {
    return callback(isRecoverableError(e) ? new repl.Recoverable(e) : e);
  }
  return callback(null, result);
};

const isRecoverableError = (error: Error) => {
  if (error && error.name === 'SyntaxError') {
    return [
      'Unterminated template',
      'Missing } in template expression',
      'Unexpected end of input',
      'missing ) after argument list',
      'Unexpected token',
    ].some(exception => error.message.includes(exception));
  }
  return false;
};

if (elricProjectConfig.transform) {
  let transformerPath = null;
  for (let i = 0; i < elricProjectConfig.transform.length; i++) {
    if (new RegExp(elricProjectConfig.transform[i][0]).test('foobar.js')) {
      transformerPath = elricProjectConfig.transform[i][1];
      transformerConfig = elricProjectConfig.transform[i][2];
      break;
    }
  }
  if (transformerPath) {
    transformer = interopRequireDefault(require(transformerPath)).default;
    if (typeof transformer.process !== 'function') {
      throw new TypeError(
        'elric: a transformer must export a `process` function.',
      );
    }
  }
}

const replInstance: repl.REPLServer = repl.start({
  eval: evalCommand,
  prompt: '\u203A ',
  useGlobal: true,
});

replInstance.context.require = (moduleName: string) => {
  if (/(\/|\\|\.)/.test(moduleName)) {
    moduleName = path.resolve(process.cwd(), moduleName);
  }
  return require(moduleName);
};
