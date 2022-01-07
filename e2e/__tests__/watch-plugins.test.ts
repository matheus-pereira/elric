/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {onNodeVersions} from '@elric/test-utils';
import {runContinuous} from '../runelric';

const testCompletedRE = /Ran all test suites./g;
const numberOfTestRuns = (stderr: string): number => {
  const matches = stderr.match(testCompletedRE);
  return matches ? matches.length : 0;
};

test.each(['js', 'cjs'])('supports %s watch plugins', async watchPluginDir => {
  const testRun = runContinuous(`watch-plugins/${watchPluginDir}`, [
    '--watchAll',
    '--no-watchman',
  ]);

  await testRun.waitUntil(({stderr}) => numberOfTestRuns(stderr) === 1);

  expect(testRun.getCurrentOutput().stdout.trim()).toBe('getUsageInfo');

  await testRun.end();
});

onNodeVersions('>=12.17.0', () => {
  test.each(['mjs', 'js-type-module'])(
    'supports %s watch plugins',
    async watchPluginDir => {
      const testRun = runContinuous(`watch-plugins/${watchPluginDir}`, [
        '--watchAll',
        '--no-watchman',
      ]);

      await testRun.waitUntil(({stderr}) => numberOfTestRuns(stderr) === 1);

      expect(testRun.getCurrentOutput().stdout.trim()).toBe('getUsageInfo');

      await testRun.end();
    },
  );
});
