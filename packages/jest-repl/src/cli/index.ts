#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import yargs = require('yargs');
import type {Config} from '@elric/types';
import {deprecationEntries} from 'elric-config';
import {validateCLIOptions} from 'elric-validate';
import * as args from './args';
import {run as runtimeCLI} from './runtime-cli';
import {VERSION} from './version';

const REPL_SCRIPT = require.resolve('./repl.js');

export = function (): void {
  const argv = <Config.Argv>yargs.usage(args.usage).options(args.options).argv;

  validateCLIOptions(argv, {...args.options, deprecationEntries});

  argv._ = [REPL_SCRIPT];

  runtimeCLI(argv, [`elric REPL v${VERSION}`]);
};
