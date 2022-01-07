/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {elric} from '@elric/environment';
import type {Global} from '@elric/types';
import importedExpect = require('expect');

export declare const elric: elric;

export declare const expect: typeof importedExpect;

export declare const it: Global.GlobalAdditions['it'];
export declare const test: Global.GlobalAdditions['test'];
export declare const fit: Global.GlobalAdditions['fit'];
export declare const xit: Global.GlobalAdditions['xit'];
export declare const xtest: Global.GlobalAdditions['xtest'];
export declare const describe: Global.GlobalAdditions['describe'];
export declare const xdescribe: Global.GlobalAdditions['xdescribe'];
export declare const fdescribe: Global.GlobalAdditions['fdescribe'];
export declare const beforeAll: Global.GlobalAdditions['beforeAll'];
export declare const beforeEach: Global.GlobalAdditions['beforeEach'];
export declare const afterEach: Global.GlobalAdditions['afterEach'];
export declare const afterAll: Global.GlobalAdditions['afterAll'];

throw new Error(
  'Do not import `@elric/globals` outside of the elric test environment',
);
