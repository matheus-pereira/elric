/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// This plugin exists to make sure that we use a `Promise` that has not been messed with by user code.
// Might consider extending this to other globals as well in the future

module.exports = ({template}) => {
  const promiseDeclaration = template(`
    var global = (function() {
      if (typeof globalThis !== 'undefined') {
        return globalThis;
      } else if (typeof global !== 'undefined') {
        return global;
      } else if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')();
      }
    }())
    var Promise = global[Symbol.for('elric-native-promise')] || global.Promise;
  `);
  const symbolDeclaration = template(`
    var global = (function() {
      if (typeof globalThis !== 'undefined') {
        return globalThis;
      } else if (typeof global !== 'undefined') {
        return global;
      } else if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')();
      }
    }())
    var Symbol = global['elric-symbol-do-not-touch'] || global.Symbol;
  `);
  const nowDeclaration = template(`
    var global = (function() {
      if (typeof globalThis !== 'undefined') {
        return globalThis;
      } else if (typeof global !== 'undefined') {
        return global;
      } else if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')();
      }
    }())
    var elricNow = global[Symbol.for('elric-native-now')] || global.Date.now;
  `);
  const fsReadFileDeclaration = template(`
    var global = (function() {
      if (typeof globalThis !== 'undefined') {
        return globalThis;
      } else if (typeof global !== 'undefined') {
        return global;
      } else if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')();
      }
    }())
    var elricReadFile = global[Symbol.for('elric-native-read-file')] || fs.readFileSync;
  `);
  const fsWriteFileDeclaration = template(`
    var global = (function() {
      if (typeof globalThis !== 'undefined') {
        return globalThis;
      } else if (typeof global !== 'undefined') {
        return global;
      } else if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')();
      }
    }())
    var elricWriteFile = global[Symbol.for('elric-native-write-file')] || fs.writeFileSync;
  `);
  const fsExistsFileDeclaration = template(`
    var global = (function() {
      if (typeof globalThis !== 'undefined') {
        return globalThis;
      } else if (typeof global !== 'undefined') {
        return global;
      } else if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')();
      }
    }())
    var elricExistsFile = global[Symbol.for('elric-native-exists-file')] || fs.existsSync;
  `);

  return {
    name: 'elric-native-globals',
    visitor: {
      ReferencedIdentifier(path, state) {
        if (path.node.name === 'Promise' && !state.elricInjectedPromise) {
          state.elricInjectedPromise = true;
          path
            .findParent(p => p.isProgram())
            .unshiftContainer('body', promiseDeclaration());
          path
            .findParent(p => p.isProgram())
            .unshiftContainer('body', symbolDeclaration());
        }
        if (path.node.name === 'Symbol' && !state.elricInjectedSymbol) {
          state.elricInjectedSymbol = true;
          path
            .findParent(p => p.isProgram())
            .unshiftContainer('body', symbolDeclaration());
        }
        if (
          path.node.name === 'Date' &&
          path.parent.property &&
          path.parent.property.name === 'now'
        ) {
          if (!state.elricInjectedNow) {
            state.elricInjectedNow = true;
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', nowDeclaration());
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', symbolDeclaration());
          }

          path.parentPath.replaceWithSourceString('elricNow');
        }
        if (
          path.node.name === 'fs' &&
          path.parent.property &&
          ['readFileSync', 'writeFileSync', 'existsSync'].includes(
            path.parent.property.name,
          )
        ) {
          if (
            !state.elricInjectedRead &&
            path.parent.property.name === 'readFileSync'
          ) {
            state.elricInjectedRead = true;
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', fsReadFileDeclaration());
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', symbolDeclaration());

            path.parentPath.replaceWithSourceString('elricReadFile');
          }
          if (
            !state.elricInjectedWrite &&
            path.parent.property.name === 'writeFileSync'
          ) {
            state.elricInjectedWrite = true;
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', fsWriteFileDeclaration());
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', symbolDeclaration());

            path.parentPath.replaceWithSourceString('elricWriteFile');
          }
          if (
            !state.elricInjectedExists &&
            path.parent.property.name === 'existsSync'
          ) {
            state.elricInjectedExists = true;
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', fsExistsFileDeclaration());
            path
              .findParent(p => p.isProgram())
              .unshiftContainer('body', symbolDeclaration());

            path.parentPath.replaceWithSourceString('elricExistsFile');
          }
        }
      },
    },
  };
};
