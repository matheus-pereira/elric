/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const path = require('path');

let createRuntime;

const rootJsPath = path.join('.', path.sep, 'root');

describe('Runtime', () => {
  beforeEach(() => {
    createRuntime = require('createRuntime');
  });

  describe('elric.mock', () => {
    it('uses explicitly set mocks instead of automocking', async () => {
      const runtime = await createRuntime(__filename);
      const mockReference = {isMock: true};
      const root = runtime.requireModule(runtime.__mockRootPath, rootJsPath);
      // Erase module registry because root.js requires most other modules.
      root.elric.resetModules();

      root.elric.mock('RegularModule', () => mockReference);
      root.elric.mock('ManuallyMocked', () => mockReference);
      root.elric.mock('nested1/nested2/nested3');

      expect(
        runtime.requireModuleOrMock(runtime.__mockRootPath, 'RegularModule'),
      ).toEqual(mockReference);

      expect(
        runtime.requireModuleOrMock(runtime.__mockRootPath, 'ManuallyMocked'),
      ).toEqual(mockReference);

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockRootPath,
          'nested1/nested2/nested3',
        ),
      ).toEqual(mockReference);
    });

    it('sets virtual mock for non-existing module required from same directory', async () => {
      const runtime = await createRuntime(__filename);
      const mockReference = {isVirtualMock: true};
      const virtual = true;
      const root = runtime.requireModule(runtime.__mockRootPath, rootJsPath);
      // Erase module registry because root.js requires most other modules.
      root.elric.resetModules();

      root.elric.mock('NotInstalledModule', () => mockReference, {virtual});
      root.elric.mock('../ManuallyMocked', () => mockReference, {virtual});
      root.elric.mock('/AbsolutePath/Mock', () => mockReference, {virtual});

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockRootPath,
          'NotInstalledModule',
        ),
      ).toEqual(mockReference);

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockRootPath,
          '../ManuallyMocked',
        ),
      ).toEqual(mockReference);

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockRootPath,
          '/AbsolutePath/Mock',
        ),
      ).toEqual(mockReference);
    });

    it('sets virtual mock for non-existing module required from different directory', async () => {
      const runtime = await createRuntime(__filename);
      const mockReference = {isVirtualMock: true};
      const virtual = true;
      const root = runtime.requireModule(runtime.__mockRootPath, rootJsPath);
      // Erase module registry because root.js requires most other modules.
      root.elric.resetModules();

      root.elric.mock('NotInstalledModule', () => mockReference, {virtual});
      root.elric.mock('../ManuallyMocked', () => mockReference, {virtual});
      root.elric.mock('/AbsolutePath/Mock', () => mockReference, {virtual});

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockSubdirPath,
          'NotInstalledModule',
        ),
      ).toEqual(mockReference);

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockSubdirPath,
          '../../../ManuallyMocked',
        ),
      ).toEqual(mockReference);

      expect(
        runtime.requireModuleOrMock(
          runtime.__mockSubdirPath,
          '/AbsolutePath/Mock',
        ),
      ).toEqual(mockReference);
    });
  });

  describe('elric.setMock', () => {
    it('uses explicitly set mocks instead of automocking', async () => {
      const runtime = await createRuntime(__filename);
      const mockReference = {isMock: true};
      const root = runtime.requireModule(runtime.__mockRootPath, rootJsPath);
      // Erase module registry because root.js requires most other modules.
      root.elric.resetModules();

      root.elric.setMock('RegularModule', mockReference);
      root.elric.setMock('ManuallyMocked', mockReference);

      expect(
        runtime.requireModuleOrMock(runtime.__mockRootPath, 'RegularModule'),
      ).toBe(mockReference);

      expect(
        runtime.requireModuleOrMock(runtime.__mockRootPath, 'ManuallyMocked'),
      ).toBe(mockReference);
    });
  });
});
