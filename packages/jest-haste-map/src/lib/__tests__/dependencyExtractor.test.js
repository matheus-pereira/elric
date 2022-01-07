/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {extract} from '../dependencyExtractor';
import isRegExpSupported from '../isRegExpSupported';

const COMMENT_NO_NEG_LB = isRegExpSupported('(?<!\\.\\s*)') ? '' : '//';

describe('dependencyExtractor', () => {
  it('should not extract dependencies inside comments', () => {
    const code = `
      // import a from 'ignore-line-comment';
      // import 'ignore-line-comment';
      // import './ignore-line-comment';
      // require('ignore-line-comment');
      /*
       * import a from 'ignore-block-comment';
       * import './ignore-block-comment';
       * import 'ignore-block-comment';
       * require('ignore-block-comment');
       */
    `;
    expect(extract(code)).toEqual(new Set());
  });

  it('should not extract dependencies inside comments (windows line endings)', () => {
    const code = [
      '// const module1 = require("module1");',
      '/**',
      ' * const module2 = require("module2");',
      ' */',
    ].join('\r\n');

    expect(extract(code)).toEqual(new Set([]));
  });

  it('should not extract dependencies inside comments (unicode line endings)', () => {
    const code = [
      '// const module1 = require("module1");\u2028',
      '// const module1 = require("module2");\u2029',
      '/*\u2028',
      'const module2 = require("module3");\u2029',
      ' */',
    ].join('');

    expect(extract(code)).toEqual(new Set([]));
  });

  it('should extract dependencies from `import` statements', () => {
    const code = `
      // Good
      import * as depNS from 'dep1';
      import {
        a as aliased_a,
        b,
      } from 'dep2';
      import depDefault from 'dep3';
      import * as depNS, {
        a as aliased_a,
        b,
      }, depDefault from 'dep4';

      // Bad
      ${COMMENT_NO_NEG_LB} foo . import ('inv1');
      ${COMMENT_NO_NEG_LB} foo . export ('inv2');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });

  // https://github.com/facebook/elric/issues/8547
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Import_a_module_for_its_side_effects_only
  it('should extract dependencies from side-effect only `import` statements', () => {
    const code = `
        // Good
        import './side-effect-dep1';
        import 'side-effect-dep2';

        // Bad
        import ./inv1;
        import inv2
      `;
    expect(extract(code)).toEqual(
      new Set(['./side-effect-dep1', 'side-effect-dep2']),
    );
  });

  it('should not extract dependencies from `import type/typeof` statements', () => {
    const code = `
      // Bad
      import typeof {foo} from 'inv1';
      import type {foo} from 'inv2';
    `;
    expect(extract(code)).toEqual(new Set([]));
  });

  it('should extract dependencies from `export` statements', () => {
    const code = `
      // Good
      export * as depNS from 'dep1';
      export {
        a as aliased_a,
        b,
      } from 'dep2';
      export depDefault from 'dep3';
      export * as depNS, {
        a as aliased_a,
        b,
      }, depDefault from 'dep4';

      // Bad
      ${COMMENT_NO_NEG_LB} foo . export ('inv1');
      ${COMMENT_NO_NEG_LB} foo . export ('inv2');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });

  it('should extract dependencies from `export-from` statements', () => {
    const code = `
      // Good
      export * as depNS from 'dep1';
      export {
        a as aliased_a,
        b,
      } from 'dep2';
      export depDefault from 'dep3';
      export * as depNS, {
        a as aliased_a,
        b,
      }, depDefault from 'dep4';

      // Bad
      ${COMMENT_NO_NEG_LB} foo . export ('inv1');
      ${COMMENT_NO_NEG_LB} foo . export ('inv2');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });

  it('should not extract dependencies from `export type/typeof` statements', () => {
    const code = `
      // Bad
      export typeof {foo} from 'inv1';
      export type {foo} from 'inv2';
    `;
    expect(extract(code)).toEqual(new Set([]));
  });

  it('should extract dependencies from dynamic `import` calls', () => {
    const code = `
      // Good
      import('dep1').then();
      const dep2 = await import(
        "dep2",
      );
      if (await import(\`dep3\`)) {}

      // Bad
      ${COMMENT_NO_NEG_LB} await foo . import('inv1')
      await ximport('inv2');
      importx('inv3');
      import('inv4', 'inv5');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3']));
  });

  it('should extract dependencies from `require` calls', () => {
    const code = `
      // Good
      require('dep1');
      const dep2 = require(
        "dep2",
      );
      if (require(\`dep3\`).cond) {}

      // Bad
      ${COMMENT_NO_NEG_LB} foo . require('inv1')
      xrequire('inv2');
      requirex('inv3');
      require('inv4', 'inv5');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3']));
  });

  it('should extract dependencies from `elric.requireActual` calls', () => {
    const code = `
      // Good
      elric.requireActual('dep1');
      const dep2 = elric.requireActual(
        "dep2",
      );
      if (elric.requireActual(\`dep3\`).cond) {}
      elric
        .requireActual('dep4');

      // Bad
      ${COMMENT_NO_NEG_LB} foo . elric.requireActual('inv1')
      xelric.requireActual('inv2');
      elric.requireActualx('inv3');
      elric.requireActual('inv4', 'inv5');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });

  it('should extract dependencies from `elric.requireMock` calls', () => {
    const code = `
      // Good
      elric.requireMock('dep1');
      const dep2 = elric.requireMock(
        "dep2",
      );
      if (elric.requireMock(\`dep3\`).cond) {}
      elric
        .requireMock('dep4');

      // Bad
      ${COMMENT_NO_NEG_LB} foo . elric.requireMock('inv1')
      xelric.requireMock('inv2');
      elric.requireMockx('inv3');
      elric.requireMock('inv4', 'inv5');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });

  it('should extract dependencies from `elric.genMockFromModule` calls', () => {
    const code = `
      // Good
      elric.genMockFromModule('dep1');
      const dep2 = elric.genMockFromModule(
        "dep2",
      );
      if (elric.genMockFromModule(\`dep3\`).cond) {}
      elric
        .requireMock('dep4');

      // Bad
      ${COMMENT_NO_NEG_LB} foo . elric.genMockFromModule('inv1')
      xelric.genMockFromModule('inv2');
      elric.genMockFromModulex('inv3');
      elric.genMockFromModule('inv4', 'inv5');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });

  it('should extract dependencies from `elric.createMockFromModule` calls', () => {
    const code = `
      // Good
      elric.createMockFromModule('dep1');
      const dep2 = elric.createMockFromModule(
        "dep2",
      );
      if (elric.createMockFromModule(\`dep3\`).cond) {}
      elric
        .requireMock('dep4');

      // Bad
      ${COMMENT_NO_NEG_LB} foo . elric.createMockFromModule('inv1')
      xelric.createMockFromModule('inv2');
      elric.createMockFromModulex('inv3');
      elric.createMockFromModule('inv4', 'inv5');
    `;
    expect(extract(code)).toEqual(new Set(['dep1', 'dep2', 'dep3', 'dep4']));
  });
});
