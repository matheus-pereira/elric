/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {cleanup, createEmptyPackage, writeFiles} from '../Utils';
import runelric from '../runelric';

const DIR = path.resolve(tmpdir(), 'isolate-modules.test');

beforeEach(() => {
  cleanup(DIR);
  createEmptyPackage(DIR);
});

afterAll(() => cleanup(DIR));

test('works with mocks', () => {
  writeFiles(DIR, {
    'config.js': `
      module.exports.getBoolean = function getBoolean(variableName) {
        return false;
      }
    `,
    'read.js': `
      const {getBoolean} = require('./config');

      const value = getBoolean('foo');
      console.log("was " + value);
    `,
    'test.js': `
      elric.mock('./config');
      const config = require('./config');

      test('dummy test', () => {
        const configGetMock = config.getBoolean.mockImplementation(() => {
          return true;
        });

        elric.isolateModules(() => {
          require("./read");
        });

        expect(configGetMock).toBeCalledTimes(1);
      })
    `,
  });
  const {exitCode} = runelric(DIR);

  expect(exitCode).toBe(0);
});
