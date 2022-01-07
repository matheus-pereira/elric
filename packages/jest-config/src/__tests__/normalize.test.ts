/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {createHash} from 'crypto';
import path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import semver = require('semver');
import stripAnsi from 'strip-ansi';
import type {Config} from '@elric/types';
import {escapeStrForRegex} from 'elric-regex-util';
import Defaults from '../Defaults';
import {DEFAULT_JS_PATTERN} from '../constants';
import normalize from '../normalize';

const DEFAULT_CSS_PATTERN = '\\.(css)$';

elric
  .mock('path', () => elric.requireActual('path').posix)
  .mock('graceful-fs', () => {
    const realFs = elric.requireActual('fs');

    return {
      ...realFs,
      statSync: () => ({isDirectory: () => true}),
    };
  });

let root: string;
let expectedPathFooBar: string;
let expectedPathFooQux: string;
let expectedPathAbs: string;
let expectedPathAbsAnother: string;

let virtualModuleRegexes: Array<RegExp>;
beforeEach(() => (virtualModuleRegexes = [/elric-circus/, /babel-elric/]));
const findNodeModule = elric.fn(name => {
  if (virtualModuleRegexes.some(regex => regex.test(name))) {
    return name;
  }
  return null;
});

// Windows uses backslashes for path separators, which need to be escaped in
// regular expressions. This little helper function helps us generate the
// expected strings for checking path patterns.
function joinForPattern(...args: Array<string>) {
  return args.join(escapeStrForRegex(path.sep));
}

beforeEach(() => {
  root = path.resolve('/');
  expectedPathFooBar = path.join(root, 'root', 'path', 'foo', 'bar', 'baz');
  expectedPathFooQux = path.join(root, 'root', 'path', 'foo', 'qux', 'quux');
  expectedPathAbs = path.join(root, 'an', 'abs', 'path');
  expectedPathAbsAnother = path.join(root, 'another', 'abs', 'path');

  require('elric-resolve').default.findNodeModule = findNodeModule;

  elric.spyOn(console, 'warn');
});

afterEach(() => {
  (console.warn as unknown as elric.SpyInstance).mockRestore();
});

it('picks a name based on the rootDir', async () => {
  const rootDir = '/root/path/foo';
  const expected = createHash('md5')
    .update('/root/path/foo')
    .update(String(Infinity))
    .digest('hex');
  const {options} = await normalize(
    {
      rootDir,
    },
    {} as Config.Argv,
  );
  expect(options.name).toBe(expected);
});

it('keeps custom project name based on the projects rootDir', async () => {
  const name = 'test';
  const {options} = await normalize(
    {
      projects: [{name, rootDir: '/path/to/foo'}],
      rootDir: '/root/path/baz',
    },
    {} as Config.Argv,
  );

  expect(options.projects[0].name).toBe(name);
});

it('keeps custom names based on the rootDir', async () => {
  const {options} = await normalize(
    {
      name: 'custom-name',
      rootDir: '/root/path/foo',
    },
    {} as Config.Argv,
  );

  expect(options.name).toBe('custom-name');
});

it('minimal config is stable across runs', async () => {
  const firstNormalization = await normalize(
    {rootDir: '/root/path/foo'},
    {} as Config.Argv,
  );
  const secondNormalization = await normalize(
    {rootDir: '/root/path/foo'},
    {} as Config.Argv,
  );

  expect(firstNormalization).toEqual(secondNormalization);
  expect(JSON.stringify(firstNormalization)).toBe(
    JSON.stringify(secondNormalization),
  );
});

it('sets coverageReporters correctly when argv.json is set', async () => {
  const {options} = await normalize(
    {
      rootDir: '/root/path/foo',
    },
    {
      json: true,
    } as Config.Argv,
  );

  expect(options.coverageReporters).toEqual(['json', 'lcov', 'clover']);
});

describe('rootDir', () => {
  it('throws if the options is missing a rootDir property', async () => {
    expect.assertions(1);

    await expect(
      normalize({}, {} as Config.Argv),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('automock', () => {
  it('falsy automock is not overwritten', async () => {
    (console.warn as unknown as elric.SpyInstance).mockImplementation(() => {});
    const {options} = await normalize(
      {
        automock: false,
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.automock).toBe(false);
  });
});

describe('collectCoverageOnlyFrom', () => {
  it('normalizes all paths relative to rootDir', async () => {
    const {options} = await normalize(
      {
        collectCoverageOnlyFrom: {
          'bar/baz': true,
          'qux/quux/': true,
        },
        rootDir: '/root/path/foo/',
      },
      {} as Config.Argv,
    );

    const expected = Object.create(null);
    expected[expectedPathFooBar] = true;
    expected[expectedPathFooQux] = true;

    expect(options.collectCoverageOnlyFrom).toEqual(expected);
  });

  it('does not change absolute paths', async () => {
    const {options} = await normalize(
      {
        collectCoverageOnlyFrom: {
          '/an/abs/path': true,
          '/another/abs/path': true,
        },
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    const expected = Object.create(null);
    expected[expectedPathAbs] = true;
    expected[expectedPathAbsAnother] = true;

    expect(options.collectCoverageOnlyFrom).toEqual(expected);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        collectCoverageOnlyFrom: {
          '<rootDir>/bar/baz': true,
        },
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    const expected = Object.create(null);
    expected[expectedPathFooBar] = true;

    expect(options.collectCoverageOnlyFrom).toEqual(expected);
  });
});

describe('collectCoverageFrom', () => {
  it('substitutes <rootDir> tokens', async () => {
    const barBaz = 'bar/baz';
    const quxQuux = 'qux/quux/';
    const notQuxQuux = `!${quxQuux}`;

    const {options} = await normalize(
      {
        collectCoverageFrom: [
          barBaz,
          notQuxQuux,
          `<rootDir>/${barBaz}`,
          `!<rootDir>/${quxQuux}`,
        ],
        rootDir: '/root/path/foo/',
      },
      {} as Config.Argv,
    );

    const expected = [barBaz, notQuxQuux, barBaz, notQuxQuux];

    expect(options.collectCoverageFrom).toEqual(expected);
  });
});

describe('findRelatedTests', () => {
  it('it generates --coverageCoverageFrom patterns when needed', async () => {
    const sourceFile = 'file1.js';

    const {options} = await normalize(
      {
        collectCoverage: true,
        rootDir: '/root/path/foo/',
      },
      {
        _: [
          `/root/path/${sourceFile}`,
          sourceFile,
          `<rootDir>/bar/${sourceFile}`,
        ],
        findRelatedTests: true,
      } as Config.Argv,
    );

    const expected = [`../${sourceFile}`, `${sourceFile}`, `bar/${sourceFile}`];

    expect(options.collectCoverageFrom).toEqual(expected);
  });
});

function testPathArray(key: string) {
  it('normalizes all paths relative to rootDir', async () => {
    const {options} = await normalize(
      {
        [key]: ['bar/baz', 'qux/quux/'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options[key]).toEqual([expectedPathFooBar, expectedPathFooQux]);
  });

  it('does not change absolute paths', async () => {
    const {options} = await normalize(
      {
        [key]: ['/an/abs/path', '/another/abs/path'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options[key]).toEqual([expectedPathAbs, expectedPathAbsAnother]);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        [key]: ['<rootDir>/bar/baz'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options[key]).toEqual([expectedPathFooBar]);
  });
}

describe('roots', () => {
  testPathArray('roots');
});

describe('transform', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => name);
  });

  it('normalizes the path', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        transform: {
          [DEFAULT_CSS_PATTERN]: '<rootDir>/node_modules/elric-regex-util',
          [DEFAULT_JS_PATTERN]: 'babel-elric',
          'abs-path': '/qux/quux',
        },
      },
      {} as Config.Argv,
    );

    expect(options.transform).toEqual([
      [DEFAULT_CSS_PATTERN, '/root/node_modules/elric-regex-util', {}],
      [DEFAULT_JS_PATTERN, require.resolve('babel-elric'), {}],
      ['abs-path', '/qux/quux', {}],
    ]);
  });
  it("pulls in config if it's passed as an array, and defaults to empty object", async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        transform: {
          [DEFAULT_CSS_PATTERN]: '<rootDir>/node_modules/elric-regex-util',
          [DEFAULT_JS_PATTERN]: ['babel-elric', {rootMode: 'upward'}],
          'abs-path': '/qux/quux',
        },
      },
      {} as Config.Argv,
    );
    expect(options.transform).toEqual([
      [DEFAULT_CSS_PATTERN, '/root/node_modules/elric-regex-util', {}],
      [DEFAULT_JS_PATTERN, require.resolve('babel-elric'), {rootMode: 'upward'}],
      ['abs-path', '/qux/quux', {}],
    ]);
  });
});

describe('haste', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => name);
  });

  it('normalizes the path for hasteImplModulePath', async () => {
    const {options} = await normalize(
      {
        haste: {
          hasteImplModulePath: '<rootDir>/haste_impl.js',
        },
        rootDir: '/root/',
      },
      {} as Config.Argv,
    );

    expect(options.haste).toEqual({
      hasteImplModulePath: '/root/haste_impl.js',
    });
  });
});

describe('setupFilesAfterEnv', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name =>
      name.startsWith('/') ? name : '/root/path/foo' + path.sep + name,
    );
  });

  it('normalizes the path according to rootDir', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        setupFilesAfterEnv: ['bar/baz'],
      },
      {} as Config.Argv,
    );

    expect(options.setupFilesAfterEnv).toEqual([expectedPathFooBar]);
  });

  it('does not change absolute paths', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        setupFilesAfterEnv: ['/an/abs/path'],
      },
      {} as Config.Argv,
    );

    expect(options.setupFilesAfterEnv).toEqual([expectedPathAbs]);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        setupFilesAfterEnv: ['<rootDir>/bar/baz'],
      },
      {} as Config.Argv,
    );

    expect(options.setupFilesAfterEnv).toEqual([expectedPathFooBar]);
  });
});

describe('setupTestFrameworkScriptFile', () => {
  let Resolver;

  beforeEach(() => {
    (console.warn as unknown as elric.SpyInstance).mockImplementation(() => {});
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name =>
      name.startsWith('/') ? name : '/root/path/foo' + path.sep + name,
    );
  });

  it('logs a deprecation warning when `setupTestFrameworkScriptFile` is used', async () => {
    await normalize(
      {
        rootDir: '/root/path/foo',
        setupTestFrameworkScriptFile: 'bar/baz',
      },
      {} as Config.Argv,
    );

    expect(
      (console.warn as unknown as elric.SpyInstance).mock.calls[0][0],
    ).toMatchSnapshot();
  });

  it('logs an error when `setupTestFrameworkScriptFile` and `setupFilesAfterEnv` are used', async () => {
    await expect(
      normalize(
        {
          rootDir: '/root/path/foo',
          setupFilesAfterEnv: ['bar/baz'],
          setupTestFrameworkScriptFile: 'bar/baz',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('coveragePathIgnorePatterns', () => {
  it('does not normalize paths relative to rootDir', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        coveragePathIgnorePatterns: ['bar/baz', 'qux/quux'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.coveragePathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux'),
    ]);
  });

  it('does not normalize trailing slashes', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        coveragePathIgnorePatterns: ['bar/baz', 'qux/quux/'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.coveragePathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux', ''),
    ]);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        coveragePathIgnorePatterns: ['hasNoToken', '<rootDir>/hasAToken'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.coveragePathIgnorePatterns).toEqual([
      'hasNoToken',
      joinForPattern('', 'root', 'path', 'foo', 'hasAToken'),
    ]);
  });
});

describe('watchPathIgnorePatterns', () => {
  it('does not normalize paths relative to rootDir', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        watchPathIgnorePatterns: ['bar/baz', 'qux/quux'],
      },
      {} as Config.Argv,
    );

    expect(options.watchPathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux'),
    ]);
  });

  it('does not normalize trailing slashes', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        watchPathIgnorePatterns: ['bar/baz', 'qux/quux/'],
      },
      {} as Config.Argv,
    );

    expect(options.watchPathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux', ''),
    ]);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        watchPathIgnorePatterns: ['hasNoToken', '<rootDir>/hasAToken'],
      },
      {} as Config.Argv,
    );

    expect(options.watchPathIgnorePatterns).toEqual([
      'hasNoToken',
      joinForPattern('', 'root', 'path', 'foo', 'hasAToken'),
    ]);
  });
});

describe('testPathIgnorePatterns', () => {
  it('does not normalize paths relative to rootDir', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        testPathIgnorePatterns: ['bar/baz', 'qux/quux'],
      },
      {} as Config.Argv,
    );

    expect(options.testPathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux'),
    ]);
  });

  it('does not normalize trailing slashes', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        testPathIgnorePatterns: ['bar/baz', 'qux/quux/'],
      },
      {} as Config.Argv,
    );

    expect(options.testPathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux', ''),
    ]);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
        testPathIgnorePatterns: ['hasNoToken', '<rootDir>/hasAToken'],
      },
      {} as Config.Argv,
    );

    expect(options.testPathIgnorePatterns).toEqual([
      'hasNoToken',
      joinForPattern('', 'root', 'path', 'foo', 'hasAToken'),
    ]);
  });
});

describe('modulePathIgnorePatterns', () => {
  it('does not normalize paths relative to rootDir', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        modulePathIgnorePatterns: ['bar/baz', 'qux/quux'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.modulePathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux'),
    ]);
  });

  it('does not normalize trailing slashes', async () => {
    // This is a list of patterns, so we can't assume any of them are
    // directories
    const {options} = await normalize(
      {
        modulePathIgnorePatterns: ['bar/baz', 'qux/quux/'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.modulePathIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux', ''),
    ]);
  });

  it('substitutes <rootDir> tokens', async () => {
    const {options} = await normalize(
      {
        modulePathIgnorePatterns: ['hasNoToken', '<rootDir>/hasAToken'],
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.modulePathIgnorePatterns).toEqual([
      'hasNoToken',
      joinForPattern('', 'root', 'path', 'foo', 'hasAToken'),
    ]);
  });
});

describe('testRunner', () => {
  it('defaults to Circus', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.testRunner).toMatch('elric-circus');
  });

  it('resolves jasmine', async () => {
    const Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => name);
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
      },
      {
        testRunner: 'jasmine2',
      } as Config.Argv,
    );

    expect(options.testRunner).toMatch('elric-jasmine2');
  });

  it('is overwritten by argv', async () => {
    const Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => name);
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
      },
      {
        testRunner: 'mocha',
      } as Config.Argv,
    );

    expect(options.testRunner).toBe('mocha');
  });
});

describe('coverageDirectory', () => {
  it('defaults to <rootDir>/coverage', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.coverageDirectory).toBe('/root/path/foo/coverage');
  });
});

describe('testEnvironment', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => {
      if (['jsdom', 'elric-environment-jsdom'].includes(name)) {
        return `node_modules/${name}`;
      }
      if (name.startsWith('/root')) {
        return name;
      }
      return findNodeModule(name);
    });
  });

  it('resolves to an environment and prefers elric-environment-`name`', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testEnvironment: 'jsdom',
      },
      {} as Config.Argv,
    );

    expect(options.testEnvironment).toEqual(
      'node_modules/elric-environment-jsdom',
    );
  });

  it('resolves to node environment by default', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
      },
      {} as Config.Argv,
    );

    expect(options.testEnvironment).toEqual(
      require.resolve('elric-environment-node'),
    );
  });

  it('throws on invalid environment names', async () => {
    await expect(
      normalize(
        {
          rootDir: '/root',
          testEnvironment: 'phantom',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('works with rootDir', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testEnvironment: '<rootDir>/testEnvironment.js',
      },
      {} as Config.Argv,
    );

    expect(options.testEnvironment).toEqual('/root/testEnvironment.js');
  });
});

describe('babel-elric', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name =>
      name.indexOf('babel-elric') === -1
        ? path.sep + 'node_modules' + path.sep + name
        : name,
    );
  });

  it('correctly identifies and uses babel-elric', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
      },
      {} as Config.Argv,
    );

    expect(options.transform[0][0]).toBe(DEFAULT_JS_PATTERN);
    expect(options.transform[0][1]).toEqual(require.resolve('babel-elric'));
  });

  it('uses babel-elric if babel-elric is explicitly specified in a custom transform options', async () => {
    const customJSPattern = '\\.js$';
    const {options} = await normalize(
      {
        rootDir: '/root',
        transform: {
          [customJSPattern]: 'babel-elric',
        },
      },
      {} as Config.Argv,
    );

    expect(options.transform[0][0]).toBe(customJSPattern);
    expect(options.transform[0][1]).toEqual(require.resolve('babel-elric'));
  });
});

describe('Upgrade help', () => {
  beforeEach(() => {
    (console.warn as unknown as elric.SpyInstance).mockImplementation(() => {});

    const Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => {
      if (name == 'bar/baz') {
        return '/node_modules/bar/baz';
      }
      return findNodeModule(name);
    });
  });

  it('logs a warning when `scriptPreprocessor` and/or `preprocessorIgnorePatterns` are used', async () => {
    const {options: options, hasDeprecationWarnings} = await normalize(
      {
        preprocessorIgnorePatterns: ['bar/baz', 'qux/quux'],
        rootDir: '/root/path/foo',
        scriptPreprocessor: 'bar/baz',
      },
      {} as Config.Argv,
    );

    expect(options.transform).toEqual([['.*', '/node_modules/bar/baz', {}]]);
    expect(options.transformIgnorePatterns).toEqual([
      joinForPattern('bar', 'baz'),
      joinForPattern('qux', 'quux'),
    ]);

    expect(options).not.toHaveProperty('scriptPreprocessor');
    expect(options).not.toHaveProperty('preprocessorIgnorePatterns');
    expect(hasDeprecationWarnings).toBeTruthy();

    expect(
      (console.warn as unknown as elric.SpyInstance).mock.calls[0][0],
    ).toMatchSnapshot();
  });
});

describe('testRegex', () => {
  it('testRegex empty string is mapped to empty array', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testRegex: '',
      },
      {} as Config.Argv,
    );

    expect(options.testRegex).toEqual([]);
  });
  it('testRegex string is mapped to an array', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testRegex: '.*',
      },
      {} as Config.Argv,
    );

    expect(options.testRegex).toEqual(['.*']);
  });
  it('testRegex array is preserved', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testRegex: ['.*', 'foo\\.bar'],
      },
      {} as Config.Argv,
    );

    expect(options.testRegex).toEqual(['.*', 'foo\\.bar']);
  });
});

describe('testMatch', () => {
  it('testMatch default not applied if testRegex is set', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testRegex: '.*',
      },
      {} as Config.Argv,
    );

    expect(options.testMatch.length).toBe(0);
  });

  it('testRegex default not applied if testMatch is set', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testMatch: ['**/*.js'],
      },
      {} as Config.Argv,
    );

    expect(options.testRegex).toEqual([]);
  });

  it('throws if testRegex and testMatch are both specified', async () => {
    await expect(
      normalize(
        {
          rootDir: '/root',
          testMatch: ['**/*.js'],
          testRegex: '.*',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('normalizes testMatch', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root',
        testMatch: ['<rootDir>/**/*.js'],
      },
      {} as Config.Argv,
    );

    expect(options.testMatch).toEqual(['/root/**/*.js']);
  });
});

describe('moduleDirectories', () => {
  it('defaults to node_modules', async () => {
    const {options} = await normalize({rootDir: '/root'}, {} as Config.Argv);

    expect(options.moduleDirectories).toEqual(['node_modules']);
  });

  it('normalizes moduleDirectories', async () => {
    const {options} = await normalize(
      {
        moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules'],
        rootDir: '/root',
      },
      {} as Config.Argv,
    );

    expect(options.moduleDirectories).toEqual([
      '/root/src',
      '/root/node_modules',
    ]);
  });
});

describe('preset', () => {
  beforeEach(() => {
    const Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => {
      if (name === 'react-native/elric-preset') {
        return '/node_modules/react-native/elric-preset.json';
      }

      if (name === 'react-native-js-preset/elric-preset') {
        return '/node_modules/react-native-js-preset/elric-preset.js';
      }

      if (name === 'cjs-preset/elric-preset') {
        return '/node_modules/cjs-preset/elric-preset.cjs';
      }

      if (name === 'mjs-preset/elric-preset') {
        return '/node_modules/mjs-preset/elric-preset.mjs';
      }

      if (name.includes('doesnt-exist')) {
        return null;
      }

      return '/node_modules/' + name;
    });
    elric.doMock(
      '/node_modules/react-native/elric-preset.json',
      () => ({
        moduleNameMapper: {b: 'b'},
        modulePathIgnorePatterns: ['b'],
        setupFiles: ['b'],
        setupFilesAfterEnv: ['b'],
        transform: {b: 'b'},
      }),
      {virtual: true},
    );
    elric.doMock(
      '/node_modules/react-native-js-preset/elric-preset.js',
      () => ({
        moduleNameMapper: {
          json: true,
        },
      }),
      {virtual: true},
    );
    elric.doMock(
      '/node_modules/cjs-preset/elric-preset.cjs',
      () => ({
        moduleNameMapper: {
          cjs: true,
        },
      }),
      {virtual: true},
    );
    elric.doMock(
      '/node_modules/mjs-preset/elric-preset.mjs',
      () => ({
        moduleNameMapper: {
          mjs: true,
        },
      }),
      {virtual: true},
    );
  });

  afterEach(() => {
    elric.dontMock('/node_modules/react-native/elric-preset.json');
    elric.dontMock('/node_modules/react-native-js-preset/elric-preset.js');
    elric.dontMock('/node_modules/cjs-preset/elric-preset.cjs');
    elric.dontMock('/node_modules/mjs-preset/elric-preset.mjs');
  });

  test('throws when preset not found', async () => {
    await expect(
      normalize(
        {
          preset: 'doesnt-exist',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  test('throws when module was found but no "elric-preset.js" or "elric-preset.json" files', async () => {
    await expect(
      normalize(
        {
          preset: 'exist-but-no-elric-preset',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  test('throws when a dependency is missing in the preset', async () => {
    elric.doMock(
      '/node_modules/react-native-js-preset/elric-preset.js',
      () => {
        require('library-that-is-not-installed');
        return {
          transform: {} as Config.Argv,
        };
      },
      {virtual: true},
    );

    await expect(
      normalize(
        {
          preset: 'react-native-js-preset',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowError(
      /Cannot find module 'library-that-is-not-installed'/,
    );
  });

  test('throws when preset is invalid', async () => {
    elric.doMock('/node_modules/react-native/elric-preset.json', () =>
      elric.requireActual('./elric-preset.json'),
    );

    await expect(
      normalize(
        {
          preset: 'react-native',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowError(
      /Unexpected token } in JSON at position 104[\s\S]* at /,
    );
  });

  test('throws when preset evaluation throws type error', async () => {
    elric.doMock(
      '/node_modules/react-native-js-preset/elric-preset.js',
      () => ({
        transform: {}.nonExistingProp.call(),
      }),
      {virtual: true},
    );

    const errorMessage = semver.satisfies(process.versions.node, '>=16.9.1')
      ? "TypeError: Cannot read properties of undefined (reading 'call')"
      : /TypeError: Cannot read property 'call' of undefined[\s\S]* at /;

    await expect(
      normalize(
        {
          preset: 'react-native-js-preset',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowError(errorMessage);
  });

  test('works with "react-native"', async () => {
    await expect(
      normalize(
        {
          preset: 'react-native',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).resolves.not.toThrow();
  });

  test.each(['react-native-js-preset', 'cjs-preset'])(
    'works with cjs preset',
    async presetName => {
      await expect(
        normalize(
          {
            preset: presetName,
            rootDir: '/root/path/foo',
          },
          {} as Config.Argv,
        ),
      ).resolves.not.toThrow();
    },
  );

  test('works with esm preset', async () => {
    await expect(
      normalize(
        {
          preset: 'mjs-preset',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      ),
    ).resolves.not.toThrow();
  });

  test('searches for .json, .js, .cjs, .mjs preset files', async () => {
    const Resolver = require('elric-resolve').default;

    await normalize(
      {
        preset: 'react-native',
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    const options = Resolver.findNodeModule.mock.calls[0][1];
    expect(options.extensions).toEqual(['.json', '.js', '.cjs', '.mjs']);
  });

  test('merges with options', async () => {
    const {options} = await normalize(
      {
        moduleNameMapper: {a: 'a'},
        modulePathIgnorePatterns: ['a'],
        preset: 'react-native',
        rootDir: '/root/path/foo',
        setupFiles: ['a'],
        setupFilesAfterEnv: ['a'],
        transform: {a: 'a'},
      },
      {} as Config.Argv,
    );

    expect(options.moduleNameMapper).toEqual([
      ['a', 'a'],
      ['b', 'b'],
    ]);
    expect(options.modulePathIgnorePatterns).toEqual(['b', 'a']);
    expect(options.setupFiles.sort()).toEqual([
      '/node_modules/a',
      '/node_modules/b',
    ]);
    expect(options.setupFilesAfterEnv.sort()).toEqual([
      '/node_modules/a',
      '/node_modules/b',
    ]);
    expect(options.transform).toEqual([
      ['a', '/node_modules/a', {}],
      ['b', '/node_modules/b', {}],
    ]);
  });

  test('merges with options and moduleNameMapper preset is overridden by options', async () => {
    // Object initializer not used for properties as a workaround for
    //  sort-keys eslint rule while specifying properties in
    //  non-alphabetical order for a better test
    const moduleNameMapper = {} as Record<string, string>;
    moduleNameMapper.e = 'ee';
    moduleNameMapper.b = 'bb';
    moduleNameMapper.c = 'cc';
    moduleNameMapper.a = 'aa';
    const {options} = await normalize(
      {
        moduleNameMapper,
        preset: 'react-native',
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.moduleNameMapper).toEqual([
      ['e', 'ee'],
      ['b', 'bb'],
      ['c', 'cc'],
      ['a', 'aa'],
    ]);
  });

  test('merges with options and transform preset is overridden by options', async () => {
    /* eslint-disable sort-keys */
    const transform = {
      e: 'ee',
      b: 'bb',
      c: 'cc',
      a: 'aa',
    };
    /* eslint-enable */
    const {options} = await normalize(
      {
        preset: 'react-native',
        rootDir: '/root/path/foo',
        transform,
      },
      {} as Config.Argv,
    );

    expect(options.transform).toEqual([
      ['e', '/node_modules/ee', {}],
      ['b', '/node_modules/bb', {}],
      ['c', '/node_modules/cc', {}],
      ['a', '/node_modules/aa', {}],
    ]);
  });

  test('extracts setupFilesAfterEnv from preset', async () => {
    const {options} = await normalize(
      {
        preset: 'react-native',
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.setupFilesAfterEnv).toEqual(['/node_modules/b']);
  });
});

describe('preset with globals', () => {
  beforeEach(() => {
    const Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => {
      if (name === 'global-foo/elric-preset') {
        return '/node_modules/global-foo/elric-preset.json';
      }

      return '/node_modules/' + name;
    });
    elric.doMock(
      '/node_modules/global-foo/elric-preset.json',
      () => ({
        globals: {
          __DEV__: false,
          config: {
            hereToStay: 'This should stay here',
          },
          myString: 'hello world',
        },
      }),
      {virtual: true},
    );
  });

  afterEach(() => {
    elric.dontMock('/node_modules/global-foo/elric-preset.json');
  });

  test('should merge the globals preset correctly', async () => {
    const {options} = await normalize(
      {
        globals: {
          __DEV__: true,
          config: {
            sideBySide: 'This should also live another day',
          },
          myString: 'hello sunshine',
          textValue: 'This is just text',
        },
        preset: 'global-foo',
        rootDir: '/root/path/foo',
      },
      {} as Config.Argv,
    );

    expect(options.globals).toEqual({
      __DEV__: true,
      config: {
        hereToStay: 'This should stay here',
        sideBySide: 'This should also live another day',
      },
      myString: 'hello sunshine',
      textValue: 'This is just text',
    });
  });
});

describe.each(['setupFiles', 'setupFilesAfterEnv'])(
  'preset without %s',
  configKey => {
    let Resolver;
    beforeEach(() => {
      Resolver = require('elric-resolve').default;
      Resolver.findNodeModule = elric.fn(
        name => path.sep + 'node_modules' + path.sep + name,
      );
    });

    beforeAll(() => {
      elric.doMock(
        '/node_modules/react-foo/elric-preset',
        () => ({
          moduleNameMapper: {b: 'b'},
          modulePathIgnorePatterns: ['b'],
        }),
        {virtual: true},
      );
    });

    afterAll(() => {
      elric.dontMock('/node_modules/react-foo/elric-preset');
    });

    it(`should normalize ${configKey} correctly`, async () => {
      const {options} = await normalize(
        {
          [configKey]: ['a'],
          preset: 'react-foo',
          rootDir: '/root/path/foo',
        },
        {} as Config.Argv,
      );

      expect(options).toEqual(
        expect.objectContaining({[configKey]: ['/node_modules/a']}),
      );
    });
  },
);

describe('runner', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => {
      if (['eslint', 'elric-runner-eslint', 'my-runner-foo'].includes(name)) {
        return `node_modules/${name}`;
      }
      if (name.startsWith('/root')) {
        return name;
      }
      return findNodeModule(name);
    });
  });

  it('defaults to `elric-runner`', async () => {
    const {options} = await normalize({rootDir: '/root'}, {} as Config.Argv);

    expect(options.runner).toBe(require.resolve('elric-runner'));
  });

  it('resolves to runners that do not have the prefix', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        runner: 'my-runner-foo',
      },
      {} as Config.Argv,
    );

    expect(options.runner).toBe('node_modules/my-runner-foo');
  });

  it('resolves to runners and prefers elric-runner-`name`', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        runner: 'eslint',
      },
      {} as Config.Argv,
    );

    expect(options.runner).toBe('node_modules/elric-runner-eslint');
  });

  it('throw error when a runner is not found', async () => {
    await expect(
      normalize(
        {
          rootDir: '/root/',
          runner: 'missing-runner',
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('watchPlugins', () => {
  let Resolver;
  beforeEach(() => {
    Resolver = require('elric-resolve').default;
    Resolver.findNodeModule = elric.fn(name => {
      if (
        ['typeahead', 'elric-watch-typeahead', 'my-watch-plugin'].includes(name)
      ) {
        return `node_modules/${name}`;
      }

      if (name.startsWith('/root')) {
        return name;
      }
      return findNodeModule(name);
    });
  });

  it('defaults to undefined', async () => {
    const {options} = await normalize({rootDir: '/root'}, {} as Config.Argv);

    expect(options.watchPlugins).toEqual(undefined);
  });

  it('resolves to watch plugins and prefers elric-watch-`name`', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        watchPlugins: ['typeahead'],
      },
      {} as Config.Argv,
    );

    expect(options.watchPlugins).toEqual([
      {config: {} as Config.Argv, path: 'node_modules/elric-watch-typeahead'},
    ]);
  });

  it('resolves watch plugins that do not have the prefix', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        watchPlugins: ['my-watch-plugin'],
      },
      {} as Config.Argv,
    );

    expect(options.watchPlugins).toEqual([
      {config: {} as Config.Argv, path: 'node_modules/my-watch-plugin'},
    ]);
  });

  it('normalizes multiple watchPlugins', async () => {
    const {options} = await normalize(
      {
        rootDir: '/root/',
        watchPlugins: ['elric-watch-typeahead', '<rootDir>/path/to/plugin'],
      },
      {} as Config.Argv,
    );

    expect(options.watchPlugins).toEqual([
      {config: {} as Config.Argv, path: 'node_modules/elric-watch-typeahead'},
      {config: {} as Config.Argv, path: '/root/path/to/plugin'},
    ]);
  });

  it('throw error when a watch plugin is not found', async () => {
    await expect(
      normalize(
        {
          rootDir: '/root/',
          watchPlugins: ['missing-plugin'],
        },
        {} as Config.Argv,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('testPathPattern', () => {
  const initialOptions = {rootDir: '/root'};
  const consoleLog = console.log;

  beforeEach(() => {
    console.log = elric.fn();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it('defaults to empty', async () => {
    const {options} = await normalize(initialOptions, {} as Config.Argv);

    expect(options.testPathPattern).toBe('');
  });

  const cliOptions = [
    {name: '--testPathPattern', property: 'testPathPattern'},
    {name: '<regexForTestFiles>', property: '_'},
  ];
  for (const opt of cliOptions) {
    describe(opt.name, () => {
      it('uses ' + opt.name + ' if set', async () => {
        const argv = {[opt.property]: ['a/b']} as Config.Argv;
        const {options} = await normalize(initialOptions, argv);

        expect(options.testPathPattern).toBe('a/b');
      });

      it('ignores invalid regular expressions and logs a warning', async () => {
        const argv = {[opt.property]: ['a(']} as Config.Argv;
        const {options} = await normalize(initialOptions, argv);

        expect(options.testPathPattern).toBe('');
        expect(
          (console.log as unknown as elric.SpyInstance).mock.calls[0][0],
        ).toMatchSnapshot();
      });

      it('joins multiple ' + opt.name + ' if set', async () => {
        const argv = {testPathPattern: ['a/b', 'c/d']} as Config.Argv;
        const {options} = await normalize(initialOptions, argv);

        expect(options.testPathPattern).toBe('a/b|c/d');
      });

      describe('posix', () => {
        it('should not escape the pattern', async () => {
          const argv = {
            [opt.property]: ['a\\/b', 'a/b', 'a\\b', 'a\\\\b'],
          } as Config.Argv;
          const {options} = await normalize(initialOptions, argv);

          expect(options.testPathPattern).toBe('a\\/b|a/b|a\\b|a\\\\b');
        });
      });

      describe('win32', () => {
        beforeEach(() => {
          elric.mock('path', () => elric.requireActual('path').win32);
          require('elric-resolve').default.findNodeModule = findNodeModule;
        });

        afterEach(() => {
          elric.resetModules();
        });

        it('preserves any use of "\\"', async () => {
          const argv = {[opt.property]: ['a\\b', 'c\\\\d']};
          const {options} = await require('../normalize').default(
            initialOptions,
            argv,
          );

          expect(options.testPathPattern).toBe('a\\b|c\\\\d');
        });

        it('replaces POSIX path separators', async () => {
          const argv = {[opt.property]: ['a/b']};
          const {options} = await require('../normalize').default(
            initialOptions,
            argv,
          );

          expect(options.testPathPattern).toBe('a\\\\b');
        });

        it('replaces POSIX paths in multiple args', async () => {
          const argv = {[opt.property]: ['a/b', 'c/d']};
          const {options} = await require('../normalize').default(
            initialOptions,
            argv,
          );

          expect(options.testPathPattern).toBe('a\\\\b|c\\\\d');
        });

        it('coerces all patterns to strings', async () => {
          const argv = {[opt.property]: [1]} as Config.Argv;
          const {options} = await normalize(initialOptions, argv);

          expect(options.testPathPattern).toBe('1');
        });
      });
    });
  }

  it('joins multiple --testPathPatterns and <regexForTestFiles>', async () => {
    const {options} = await normalize(initialOptions, {
      _: ['a', 'b'],
      testPathPattern: ['c', 'd'],
    } as Config.Argv);
    expect(options.testPathPattern).toBe('a|b|c|d');
  });

  it('gives precedence to --all', async () => {
    const {options} = await normalize(initialOptions, {
      all: true,
      onlyChanged: true,
    } as Config.Argv);

    expect(options.onlyChanged).toBe(false);
  });
});

describe('moduleFileExtensions', () => {
  it('defaults to something useful', async () => {
    const {options} = await normalize({rootDir: '/root'}, {} as Config.Argv);

    expect(options.moduleFileExtensions).toEqual([
      'js',
      'jsx',
      'ts',
      'tsx',
      'json',
      'node',
    ]);
  });

  it.each([undefined, 'elric-runner'])(
    'throws if missing `js` but using elric-runner',
    async runner => {
      await expect(
        normalize(
          {
            moduleFileExtensions: ['json', 'jsx'],
            rootDir: '/root/',
            runner,
          },
          {} as Config.Argv,
        ),
      ).rejects.toThrowError("moduleFileExtensions must include 'js'");
    },
  );

  it('does not throw if missing `js` with a custom runner', async () => {
    await expect(
      normalize(
        {
          moduleFileExtensions: ['json', 'jsx'],
          rootDir: '/root/',
          runner: './', // does not need to be a valid runner for this validation
        },
        {} as Config.Argv,
      ),
    ).resolves.not.toThrow();
  });
});

describe('cwd', () => {
  it('is set to process.cwd', async () => {
    const {options} = await normalize({rootDir: '/root/'}, {} as Config.Argv);
    expect(options.cwd).toBe(process.cwd());
  });

  it('is not lost if the config has its own cwd property', async () => {
    (console.warn as unknown as elric.SpyInstance).mockImplementation(() => {});
    const {options} = await normalize(
      {
        cwd: '/tmp/config-sets-cwd-itself',
        rootDir: '/root/',
      } as Config.InitialOptions,
      {} as Config.Argv,
    );
    expect(options.cwd).toBe(process.cwd());
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('Defaults', () => {
  it('should be accepted by normalize', async () => {
    await normalize({...Defaults, rootDir: '/root'}, {} as Config.Argv);

    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe('displayName', () => {
  test.each`
    displayName             | description
    ${{}}                   | ${'is an empty object'}
    ${{name: 'hello'}}      | ${'missing color'}
    ${{color: 'green'}}     | ${'missing name'}
    ${{color: 2, name: []}} | ${'using invalid values'}
  `(
    'should throw an error when displayName is $description',
    async ({displayName}) => {
      await expect(
        normalize(
          {
            displayName,
            rootDir: '/root/',
          },
          {} as Config.Argv,
        ),
      ).rejects.toThrowErrorMatchingSnapshot();
    },
  );

  it.each([
    undefined,
    'elric-runner',
    'elric-runner-eslint',
    'elric-runner-tslint',
    'elric-runner-tsc',
  ])('generates a default color for the runner %s', async runner => {
    virtualModuleRegexes.push(/elric-runner-.+/);
    const {
      options: {displayName},
    } = await normalize(
      {
        displayName: 'project',
        rootDir: '/root/',
        runner,
      },
      {} as Config.Argv,
    );
    expect(displayName!.name).toBe('project');
    expect(displayName!.color).toMatchSnapshot();
  });
});

describe('testTimeout', () => {
  it('should return timeout value if defined', async () => {
    (console.warn as unknown as elric.SpyInstance).mockImplementation(() => {});
    const {options} = await normalize(
      {rootDir: '/root/', testTimeout: 1000},
      {} as Config.Argv,
    );

    expect(options.testTimeout).toBe(1000);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should throw an error if timeout is a negative number', async () => {
    await expect(
      normalize({rootDir: '/root/', testTimeout: -1}, {} as Config.Argv),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('extensionsToTreatAsEsm', () => {
  async function matchErrorSnapshot(callback: {
    (): Promise<{
      hasDeprecationWarnings: boolean;
      options: Config.ProjectConfig & Config.GlobalConfig;
    }>;
    (): Promise<{
      hasDeprecationWarnings: boolean;
      options: Config.ProjectConfig & Config.GlobalConfig;
    }>;
    (): any;
  }) {
    expect.assertions(1);

    try {
      await callback();
    } catch (error: any) {
      expect(wrap(stripAnsi(error.message).trim())).toMatchSnapshot();
    }
  }

  it('should pass valid config through', async () => {
    const {options} = await normalize(
      {extensionsToTreatAsEsm: ['.ts'], rootDir: '/root/'},
      {} as Config.Argv,
    );

    expect(options.extensionsToTreatAsEsm).toEqual(['.ts']);
  });

  it('should enforce leading dots', async () => {
    await matchErrorSnapshot(async () =>
      normalize(
        {extensionsToTreatAsEsm: ['ts'], rootDir: '/root/'},
        {} as Config.Argv,
      ),
    );
  });

  it.each(['.js', '.mjs', '.cjs'])('throws on %s', async ext => {
    await matchErrorSnapshot(async () =>
      normalize(
        {extensionsToTreatAsEsm: [ext], rootDir: '/root/'},
        {} as Config.Argv,
      ),
    );
  });
});

describe('haste.enableSymlinks', () => {
  it('should throw if watchman is not disabled', async () => {
    await expect(
      normalize({haste: {enableSymlinks: true}, rootDir: '/root/'}, {}),
    ).rejects.toThrow('haste.enableSymlinks is incompatible with watchman');

    await expect(
      normalize(
        {haste: {enableSymlinks: true}, rootDir: '/root/', watchman: true},
        {},
      ),
    ).rejects.toThrow('haste.enableSymlinks is incompatible with watchman');

    const {options} = await normalize(
      {haste: {enableSymlinks: true}, rootDir: '/root/', watchman: false},
      {},
    );

    expect(options.haste.enableSymlinks).toBe(true);
    expect(options.watchman).toBe(false);
  });
});

describe('haste.forceNodeFilesystemAPI', () => {
  it('should pass option through', async () => {
    const {options} = await normalize(
      {haste: {forceNodeFilesystemAPI: true}, rootDir: '/root/'},
      {},
    );

    expect(options.haste.forceNodeFilesystemAPI).toBe(true);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
