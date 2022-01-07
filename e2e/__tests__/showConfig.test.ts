/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {cleanup, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(tmpdir(), 'show-config-test');

beforeEach(() => cleanup(DIR));
afterEach(() => cleanup(DIR));

test('--showConfig outputs config info and exits', () => {
  writeFiles(DIR, {
    '__tests__/test.test.js': `test('test', () => {});`,
    'package.json': JSON.stringify({elric: {environment: 'node'}}),
  });

  let {stdout} = runelric(DIR, [
    '--showConfig',
    '--no-cache',
    // Make the snapshot flag stable on CI.
    '--updateSnapshot',
  ]);

  stdout = stdout
    .replace(/\\\\node_modules\\\\/g, 'node_modules')
    .replace(/\\\\\.pnp\\\\\.\[\^[/\\]+\]\+\$/g, '<<REPLACED_PNP_PATH>>')
    .replace(/\\\\(?:([^.]+?)|$)/g, '/$1')
    .replace(/"cacheDirectory": "(.+)"/g, '"cacheDirectory": "/tmp/elric"')
    .replace(/"name": "(.+)"/g, '"name": "[md5 hash]"')
    .replace(/"version": "(.+)"/g, '"version": "[version]"')
    .replace(/"maxWorkers": (\d+)/g, '"maxWorkers": "[maxWorkers]"')
    .replace(/"\S*show-config-test/gm, '"<<REPLACED_ROOT_DIR>>')
    .replace(/"\S*\/elric\/packages/gm, '"<<REPLACED_elric_PACKAGES_DIR>>');

  expect(wrap(stdout)).toMatchSnapshot();
});
