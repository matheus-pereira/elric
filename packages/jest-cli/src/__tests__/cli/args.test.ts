/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {Config} from '@elric/types';
import {constants} from 'elric-config';
import {buildArgv} from '../../cli';
import {check} from '../../cli/args';

describe('check', () => {
  it('returns true if the arguments are valid', () => {
    const argv = {} as Config.Argv;
    expect(check(argv)).toBe(true);
  });

  it('raises an exception if runInBand and maxWorkers are both specified', () => {
    const argv = {maxWorkers: 2, runInBand: true} as Config.Argv;
    expect(() => check(argv)).toThrow(
      'Both --runInBand and --maxWorkers were specified',
    );
  });

  it('raises an exception if onlyChanged and watchAll are both specified', () => {
    const argv = {onlyChanged: true, watchAll: true} as Config.Argv;
    expect(() => check(argv)).toThrow(
      'Both --onlyChanged and --watchAll were specified',
    );
  });

  it('raises an exception if onlyFailures and watchAll are both specified', () => {
    const argv = {onlyFailures: true, watchAll: true} as Config.Argv;
    expect(() => check(argv)).toThrow(
      'Both --onlyFailures and --watchAll were specified',
    );
  });

  it('raises an exception when lastCommit and watchAll are both specified', () => {
    const argv = {lastCommit: true, watchAll: true} as Config.Argv;
    expect(() => check(argv)).toThrow(
      'Both --lastCommit and --watchAll were specified',
    );
  });

  it('raises an exception if findRelatedTests is specified with no file paths', () => {
    const argv = {
      _: [] as Array<string>,
      findRelatedTests: true,
    } as Config.Argv;
    expect(() => check(argv)).toThrow(
      'The --findRelatedTests option requires file paths to be specified',
    );
  });

  it('raises an exception if maxWorkers is specified with no number', () => {
    const argv = {maxWorkers: undefined} as unknown as Config.Argv;
    expect(() => check(argv)).toThrow(
      'The --maxWorkers (-w) option requires a number or string to be specified',
    );
  });

  it('allows maxWorkers to be a %', () => {
    const argv = {maxWorkers: '50%'} as unknown as Config.Argv;
    expect(() => check(argv)).not.toThrow();
  });

  test.each(constants.elric_CONFIG_EXT_ORDER.map(e => e.substring(1)))(
    'allows using "%s" file for --config option',
    ext => {
      expect(() =>
        check({config: `elric.config.${ext}`} as Config.Argv),
      ).not.toThrow();
      expect(() =>
        check({config: `../test/test/my_conf.${ext}`} as Config.Argv),
      ).not.toThrow();
    },
  );

  it('raises an exception if selectProjects is not provided any project names', () => {
    const argv: Config.Argv = {selectProjects: []} as Config.Argv;
    expect(() => check(argv)).toThrow(
      'The --selectProjects option requires the name of at least one project to be specified.\n',
    );
  });

  it('raises an exception if config is not a valid JSON string', () => {
    const argv = {config: 'x:1'} as Config.Argv;
    expect(() => check(argv)).toThrow(
      'The --config option requires a JSON string literal, or a file path with one of these extensions: .js, .ts, .mjs, .cjs, .json',
    );
  });

  it('raises an exception if config is not a supported file type', () => {
    const message =
      'The --config option requires a JSON string literal, or a file path with one of these extensions: .js, .ts, .mjs, .cjs, .json';

    expect(() => check({config: 'elric.configjs'} as Config.Argv)).toThrow(
      message,
    );
    expect(() => check({config: 'elric.config.exe'} as Config.Argv)).toThrow(
      message,
    );
  });
});

describe('buildArgv', () => {
  it('should return only camelcased args ', () => {
    const mockProcessArgv = elric
      // @ts-expect-error
      .spyOn(process.argv, 'slice')
      .mockImplementation(() => ['--clear-mocks']);

    const actual = buildArgv();
    expect(actual).not.toHaveProperty('clear-mocks');
    expect(actual).toHaveProperty('clearMocks', true);
    mockProcessArgv.mockRestore();
  });
});
