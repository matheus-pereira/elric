/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {readFileSync} from 'graceful-fs';
import wrap from 'elric-snapshot-serializer-raw';
import {cleanup, runYarnInstall} from '../Utils';
import runelric from '../runelric';

const dir = path.resolve(__dirname, '../coverage-handlebars');
const coverageDir = path.join(dir, 'coverage');

beforeAll(() => {
  cleanup(coverageDir);
});

it('code coverage for Handlebars', () => {
  runYarnInstall(dir);
  const result = runelric(dir, ['--coverage', '--no-cache']);

  expect(result.exitCode).toBe(0);
  expect(wrap(result.stdout)).toMatchSnapshot();

  const coverageMapFile = path.join(coverageDir, 'coverage-final.json');
  const coverageMap = JSON.parse(readFileSync(coverageMapFile, 'utf-8'));

  expect(
    Object.keys(coverageMap).map(filename => path.basename(filename)),
  ).toEqual(['greet.hbs']);
});
