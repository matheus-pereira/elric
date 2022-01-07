/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path';
import execa = require('execa');
import type {Config} from '@elric/types';
import type {SCMAdapter} from './types';

const env = {...process.env, HGPLAIN: '1'};

const adapter: SCMAdapter = {
  findChangedFiles: async (cwd, options) => {
    const includePaths: Array<Config.Path> =
      (options && options.includePaths) || [];

    const args = ['status', '-amnu'];
    if (options && options.withAncestor) {
      args.push('--rev', `min((!public() & ::.)+.)^`);
    } else if (options && options.changedSince) {
      args.push('--rev', `ancestor(., ${options.changedSince})`);
    } else if (options && options.lastCommit === true) {
      args.push('--change', '.');
    }
    args.push(...includePaths);

    let result: execa.ExecaReturnValue;

    try {
      result = await execa('hg', args, {cwd, env});
    } catch (e: any) {
      // TODO: Should we keep the original `message`?
      e.message = e.stderr;

      throw e;
    }

    return result.stdout
      .split('\n')
      .filter(s => s !== '')
      .map(changedPath => path.resolve(cwd, changedPath));
  },

  getRoot: async cwd => {
    try {
      const result = await execa('hg', ['root'], {cwd, env});

      return result.stdout;
    } catch {
      return null;
    }
  },
};

export default adapter;
