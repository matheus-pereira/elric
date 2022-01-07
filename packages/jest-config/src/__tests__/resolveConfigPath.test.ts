/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import {cleanup, writeFiles} from '../../../../e2e/Utils';
import {elric_CONFIG_EXT_ORDER} from '../constants';
import resolveConfigPath from '../resolveConfigPath';

const DIR = path.resolve(tmpdir(), 'resolve_config_path_test');
const ERROR_PATTERN = /Could not find a config file based on provided values/;
const NO_ROOT_DIR_ERROR_PATTERN = /Can't find a root directory/;
const MULTIPLE_CONFIGS_ERROR_PATTERN = /Multiple configurations found/;

const mockConsoleWarn = () => {
  elric.spyOn(console, 'warn');
  const mockedConsoleWarn = console.warn as elric.Mock<void, Array<any>>;

  // We will mock console.warn because it would produce a lot of noise in the tests
  mockedConsoleWarn.mockImplementation(() => {});

  return mockedConsoleWarn;
};

beforeEach(() => cleanup(DIR));
afterEach(() => cleanup(DIR));

describe.each(elric_CONFIG_EXT_ORDER.slice(0))(
  'Resolve config path %s',
  extension => {
    test(`file path with "${extension}"`, () => {
      const relativeConfigPath = `a/b/c/my_config${extension}`;
      const absoluteConfigPath = path.resolve(DIR, relativeConfigPath);

      writeFiles(DIR, {[relativeConfigPath]: ''});

      // absolute
      expect(resolveConfigPath(absoluteConfigPath, DIR)).toBe(
        absoluteConfigPath,
      );
      expect(() => resolveConfigPath('/does_not_exist', DIR)).toThrowError(
        NO_ROOT_DIR_ERROR_PATTERN,
      );

      // relative
      expect(resolveConfigPath(relativeConfigPath, DIR)).toBe(
        absoluteConfigPath,
      );
      expect(() => resolveConfigPath('does_not_exist', DIR)).toThrowError(
        NO_ROOT_DIR_ERROR_PATTERN,
      );
    });

    test(`directory path with "${extension}"`, () => {
      const mockedConsoleWarn = mockConsoleWarn();

      const relativePackageJsonPath = 'a/b/c/package.json';
      const absolutePackageJsonPath = path.resolve(
        DIR,
        relativePackageJsonPath,
      );
      const relativeelricConfigPath = `a/b/c/elric.config${extension}`;
      const absoluteelricConfigPath = path.resolve(DIR, relativeelricConfigPath);

      // no configs yet. should throw
      writeFiles(DIR, {[`a/b/c/some_random_file${extension}`]: ''});

      expect(() =>
        // absolute
        resolveConfigPath(path.dirname(absoluteelricConfigPath), DIR),
      ).toThrowError(ERROR_PATTERN);

      expect(() =>
        // relative
        resolveConfigPath(path.dirname(relativeelricConfigPath), DIR),
      ).toThrowError(ERROR_PATTERN);

      writeFiles(DIR, {[relativePackageJsonPath]: ''});

      mockedConsoleWarn.mockClear();
      // absolute
      expect(
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toBe(absolutePackageJsonPath);

      // relative
      expect(
        resolveConfigPath(path.dirname(relativePackageJsonPath), DIR),
      ).toBe(absolutePackageJsonPath);
      expect(mockedConsoleWarn).not.toBeCalled();

      // elric.config.js takes precedence
      writeFiles(DIR, {[relativeelricConfigPath]: ''});

      mockedConsoleWarn.mockClear();
      // absolute
      expect(
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toBe(absoluteelricConfigPath);

      // relative
      expect(
        resolveConfigPath(path.dirname(relativePackageJsonPath), DIR),
      ).toBe(absoluteelricConfigPath);
      expect(mockedConsoleWarn).not.toBeCalled();

      // elric.config.js and package.json with 'elric' cannot be used together
      writeFiles(DIR, {[relativePackageJsonPath]: JSON.stringify({elric: {}})});

      // absolute
      mockedConsoleWarn.mockClear();
      expect(
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toBe(absoluteelricConfigPath);
      expect(mockedConsoleWarn).toBeCalledTimes(1);
      expect(mockedConsoleWarn.mock.calls[0].join()).toMatch(
        MULTIPLE_CONFIGS_ERROR_PATTERN,
      );

      // relative
      mockedConsoleWarn.mockClear();
      expect(
        resolveConfigPath(path.dirname(relativePackageJsonPath), DIR),
      ).toBe(absoluteelricConfigPath);
      expect(mockedConsoleWarn).toBeCalledTimes(1);
      expect(mockedConsoleWarn.mock.calls[0].join()).toMatch(
        MULTIPLE_CONFIGS_ERROR_PATTERN,
      );

      expect(() => {
        resolveConfigPath(
          path.join(path.dirname(relativePackageJsonPath), 'j/x/b/m/'),
          DIR,
        );
      }).toThrowError(NO_ROOT_DIR_ERROR_PATTERN);
    });
  },
);

const pickPairsWithSameOrder = <T>(array: ReadonlyArray<T>) =>
  array
    .map((value1, idx, arr) =>
      arr.slice(idx + 1).map(value2 => [value1, value2]),
    )
    // TODO: use .flat() when we drop Node 10
    .reduce((acc, val) => acc.concat(val), []);

test('pickPairsWithSameOrder', () => {
  expect(pickPairsWithSameOrder([1, 2, 3])).toStrictEqual([
    [1, 2],
    [1, 3],
    [2, 3],
  ]);
});

describe.each(pickPairsWithSameOrder(elric_CONFIG_EXT_ORDER))(
  'Using multiple configs shows warning',
  (extension1, extension2) => {
    test(`Using elric.config${extension1} and elric.config${extension2} shows warning`, () => {
      const mockedConsoleWarn = mockConsoleWarn();

      const relativeelricConfigPaths = [
        `a/b/c/elric.config${extension1}`,
        `a/b/c/elric.config${extension2}`,
      ];

      writeFiles(DIR, {
        [relativeelricConfigPaths[0]]: '',
        [relativeelricConfigPaths[1]]: '',
      });

      // multiple configs here, should print warning
      mockedConsoleWarn.mockClear();
      expect(
        resolveConfigPath(path.dirname(relativeelricConfigPaths[0]), DIR),
      ).toBe(path.resolve(DIR, relativeelricConfigPaths[0]));
      expect(mockedConsoleWarn).toBeCalledTimes(1);
      expect(mockedConsoleWarn.mock.calls[0].join()).toMatch(
        MULTIPLE_CONFIGS_ERROR_PATTERN,
      );
    });
  },
);
