/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {readConfigs} from '../index';

elric.mock('graceful-fs', () => ({
  ...elric.requireActual('fs'),
  existsSync: elric.fn(() => true),
  lstatSync: elric.fn(() => ({
    isDirectory: () => false,
  })),
}));

test('readConfigs() throws when called without project paths', async () => {
  await expect(
    // @ts-expect-error
    readConfigs(null /* argv */, [] /* projectPaths */),
  ).rejects.toThrowError('elric: No configuration found for any project.');
});
