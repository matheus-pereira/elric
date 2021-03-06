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

  describe('elric.spyOn', () => {
    it('calls the original function', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);

      let isOriginalCalled = false;
      const obj = {
        method: () => {
          isOriginalCalled = true;
        },
      };

      const spy = root.elric.spyOn(obj, 'method');

      obj.method();

      expect(isOriginalCalled).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('elric.spyOnProperty', () => {
    it('calls the original function', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);

      let isOriginalCalled = false;
      const obj = {
        get method() {
          return () => (isOriginalCalled = true);
        },
      };

      const spy = root.elric.spyOn(obj, 'method', 'get');

      obj.method();

      expect(isOriginalCalled).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});
