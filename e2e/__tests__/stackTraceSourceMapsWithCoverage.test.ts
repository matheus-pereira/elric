/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from 'path';
import wrap from 'elric-snapshot-serializer-raw';
import {extractSummary, runYarnInstall} from '../Utils';
import runelric from '../runelric';

it('processes stack traces and code frames with source maps with coverage', () => {
  const dir = path.resolve(
    __dirname,
    '../stack-trace-source-maps-with-coverage',
  );
  runYarnInstall(dir);
  const {stderr} = runelric(dir, ['--no-cache', '--coverage']);

  // Should report an error at source line 13 in lib.ts at line 10 of the test
  expect(wrap(extractSummary(stderr).rest)).toMatchSnapshot();
});
