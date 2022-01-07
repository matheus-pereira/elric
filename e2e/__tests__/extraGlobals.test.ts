/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {cleanup, createEmptyPackage, writeFiles} from '../Utils';
import {json as runelric} from '../runelric';

const DIR = path.resolve(tmpdir(), 'extra-globals');

beforeEach(() => {
  cleanup(DIR);
  createEmptyPackage(DIR, {elric: {extraGlobals: ['Math']}});
});

afterAll(() => cleanup(DIR));

test('works with injected globals', () => {
  writeFiles(DIR, {
    'test.js': `
       test('Math works when injected', () => {
         expect(Math.floor(1.5)).toBe(1);
       });
  `,
  });

  const {exitCode} = runelric(DIR);

  expect(exitCode).toBe(0);
});
