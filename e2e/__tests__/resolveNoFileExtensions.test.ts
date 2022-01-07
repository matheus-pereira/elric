/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import {cleanup, extractSummary, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(__dirname, '../resolve-no-extensions-no-js');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('show error message with matching files', () => {
  const {exitCode, stderr} = runelric('resolve-no-extensions');
  const {rest} = extractSummary(stderr);

  expect(exitCode).toBe(1);
  expect(wrap(rest)).toMatchSnapshot();
});

test('show error message when no js moduleFileExtensions', () => {
  writeFiles(DIR, {
    'index.jsx': `
      module.exports ={found: true};
    `,
    'package.json': `
      {
        "elric": {
          "moduleFileExtensions": ["jsx"]
        }
      }
    `,
    'test.jsx': `
      const m = require('../');

      test('some test', () => {
        expect(m.found).toBe(true);
      });
    `,
  });

  const {exitCode, stderr} = runelric('resolve-no-extensions-no-js');

  expect(exitCode).toBe(1);
  expect(wrap(stderr)).toMatchSnapshot();
});
