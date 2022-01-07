/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

let createRuntime;

const moduleNameMapper = {
  'module/name/(.*)': '<rootDir>/mapped_module_$1.js',
};

describe('Runtime', () => {
  beforeEach(() => {
    createRuntime = require('createRuntime');
  });

  describe('createMockFromModule', () => {
    it('does not cause side effects in the rest of the module system when generating a mock', async () => {
      const runtime = await createRuntime(__filename);
      const testRequire = runtime.requireModule.bind(
        runtime,
        runtime.__mockRootPath,
      );

      const module = testRequire('RegularModule');
      const origModuleStateValue = module.getModuleStateValue();

      expect(origModuleStateValue).toBe('default');

      // Generate a mock for a module with side effects
      const mock = module.elric.createMockFromModule('ModuleWithSideEffects');

      // Make sure we get a mock.
      expect(mock.fn()).toBe(undefined);
      expect(module.getModuleStateValue()).toBe(origModuleStateValue);
    });

    it('resolves mapped modules correctly', async () => {
      const runtime = await createRuntime(__filename, {moduleNameMapper});
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mockModule = root.elric.createMockFromModule(
        'module/name/createMockFromModule',
      );

      expect(mockModule.test.mock).toBeTruthy();
    });
  });

  it('creates mock objects in the right environment', async () => {
    const runtime = await createRuntime(__filename);
    const testRequire = runtime.requireModule.bind(
      runtime,
      runtime.__mockRootPath,
    );

    const module = testRequire('RegularModule');
    const mockModule = module.elric.createMockFromModule('RegularModule');
    const testObjectPrototype = Object.getPrototypeOf(module.object);
    const mockObjectPrototype = Object.getPrototypeOf(mockModule.object);
    expect(mockObjectPrototype).toBe(testObjectPrototype);
  });
});
