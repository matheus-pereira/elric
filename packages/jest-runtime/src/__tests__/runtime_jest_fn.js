/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

let createRuntime;

describe('Runtime', () => {
  beforeEach(() => {
    createRuntime = require('createRuntime');
  });

  describe('elric.fn', () => {
    it('creates mock functions', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mock = root.elric.fn();
      expect(mock._isMockFunction).toBe(true);
      mock();
      expect(mock).toBeCalled();
    });

    it('creates mock functions with mock implementations', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mock = root.elric.fn(string => string + ' implementation');
      expect(mock._isMockFunction).toBe(true);
      const value = mock('mock');
      expect(value).toEqual('mock implementation');
      expect(mock).toBeCalled();
    });
  });

  describe('elric.isMockFunction', () => {
    it('recognizes a mocked function', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mock = root.elric.fn();
      expect(root.elric.isMockFunction(() => {})).toBe(false);
      expect(root.elric.isMockFunction(mock)).toBe(true);
    });
  });

  describe('elric.clearAllMocks', () => {
    it('clears all mocks', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);

      const mock1 = root.elric.fn();
      mock1();

      const mock2 = root.elric.fn();
      mock2();

      expect(mock1).toBeCalled();
      expect(mock2).toBeCalled();

      runtime.clearAllMocks();

      expect(mock1).not.toBeCalled();
      expect(mock2).not.toBeCalled();
    });
  });
});
