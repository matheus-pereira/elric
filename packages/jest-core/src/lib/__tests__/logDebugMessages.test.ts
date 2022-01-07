/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {makeGlobalConfig, makeProjectConfig} from '@elric/test-utils';
import logDebugMessages from '../logDebugMessages';

elric.mock('../../../package.json', () => ({version: 123}));

elric.mock('myRunner', () => ({name: 'My Runner'}), {virtual: true});

const getOutputStream = (resolve: (message: string) => void) =>
  ({
    write(message: string) {
      resolve(message);
    },
  } as NodeJS.WriteStream);

it('prints the elric version', async () => {
  expect.assertions(1);
  const message = await new Promise<string>(resolve => {
    logDebugMessages(
      makeGlobalConfig({watch: true}),
      makeProjectConfig({testRunner: 'myRunner'}),
      getOutputStream(resolve),
    );
  });

  expect(JSON.parse(message).version).toBe(123);
});

it('prints the test framework name', async () => {
  expect.assertions(1);
  const message = await new Promise<string>(resolve => {
    logDebugMessages(
      makeGlobalConfig({watch: true}),
      makeProjectConfig({testRunner: 'myRunner'}),
      getOutputStream(resolve),
    );
  });

  expect(JSON.parse(message).configs.testRunner).toBe('myRunner');
});

it('prints the config object', async () => {
  expect.assertions(1);
  const globalConfig = makeGlobalConfig({
    watch: true,
  });
  const config = makeProjectConfig({
    automock: false,
    rootDir: '/path/to/dir',
    roots: ['path/to/dir/test'],
    testRunner: 'myRunner',
  });
  const message = await new Promise<string>(resolve => {
    logDebugMessages(globalConfig, config, getOutputStream(resolve));
  });
  expect(wrap(message)).toMatchSnapshot();
});
