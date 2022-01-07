/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {onNodeVersions} from '@elric/test-utils';
import runelric, {runContinuous} from '../runelric';

try {
  require('async_hooks');
} catch (e: any) {
  if (e.code === 'MODULE_NOT_FOUND') {
    // eslint-disable-next-line elric/no-focused-tests
    fit('skip test for unsupported nodes', () => {
      console.warn('Skipping test for node ' + process.version);
    });
  } else {
    throw e;
  }
}

function getTextAfterTest(stderr: string) {
  return (stderr.split(/Ran all test suites(.*)\n/)[2] || '').trim();
}

it('prints message about flag on slow tests', async () => {
  const run = runContinuous('detect-open-handles', ['outside']);
  await run.waitUntil(({stderr}) =>
    stderr.includes(
      'elric did not exit one second after the test run has completed.',
    ),
  );
  const {stderr} = await run.end();
  const textAfterTest = getTextAfterTest(stderr);

  expect(wrap(textAfterTest)).toMatchSnapshot();
});

it('prints message about flag on forceExit', async () => {
  const run = runContinuous('detect-open-handles', ['outside', '--forceExit']);
  await run.waitUntil(({stderr}) => stderr.includes('Force exiting elric'));
  const {stderr} = await run.end();
  const textAfterTest = getTextAfterTest(stderr);

  expect(wrap(textAfterTest)).toMatchSnapshot();
});

it('prints out info about open handlers', async () => {
  const run = runContinuous('detect-open-handles', [
    'outside',
    '--detectOpenHandles',
  ]);
  await run.waitUntil(({stderr}) => stderr.includes('elric has detected'));
  const {stderr} = await run.end();
  const textAfterTest = getTextAfterTest(stderr);

  expect(wrap(textAfterTest)).toMatchSnapshot();
});

it('does not report promises', () => {
  // The test here is basically that it exits cleanly without reporting anything (does not need `until`)
  const {stderr} = runelric('detect-open-handles', [
    'promise',
    '--detectOpenHandles',
  ]);
  const textAfterTest = getTextAfterTest(stderr);

  expect(textAfterTest).toBe('');
});

it('does not report crypto random data', () => {
  // The test here is basically that it exits cleanly without reporting anything (does not need `until`)
  const {stderr} = runelric('detect-open-handles', [
    'crypto',
    '--detectOpenHandles',
  ]);
  const textAfterTest = getTextAfterTest(stderr);

  expect(textAfterTest).toBe('');
});

onNodeVersions('>=12', () => {
  it('does not report ELD histograms', () => {
    const {stderr} = runelric('detect-open-handles', [
      'histogram',
      '--detectOpenHandles',
    ]);
    const textAfterTest = getTextAfterTest(stderr);

    expect(textAfterTest).toBe('');
  });
});

describe('notify', () => {
  it('does not report --notify flag', () => {
    if (process.platform === 'win32') {
      console.warn('[SKIP] Does not work on Windows');

      return;
    }

    // The test here is basically that it exits cleanly without reporting anything (does not need `until`)
    const {stderr} = runelric('detect-open-handles', ['notify', '--notify']);
    const textAfterTest = getTextAfterTest(stderr);

    expect(textAfterTest).toBe('');
  });
});

onNodeVersions('>=12', () => {
  it('does not report timeouts using unref', () => {
    // The test here is basically that it exits cleanly without reporting anything (does not need `until`)
    const {stderr} = runelric('detect-open-handles', [
      'unref',
      '--detectOpenHandles',
    ]);
    const textAfterTest = getTextAfterTest(stderr);

    expect(textAfterTest).toBe('');
  });
});

it('prints out info about open handlers from inside tests', async () => {
  const run = runContinuous('detect-open-handles', [
    'inside',
    '--detectOpenHandles',
  ]);
  await run.waitUntil(({stderr}) => stderr.includes('elric has detected'));
  const {stderr} = await run.end();
  const textAfterTest = getTextAfterTest(stderr);

  expect(wrap(textAfterTest)).toMatchSnapshot();
});

it('prints out info about open handlers from tests with a `done` callback', async () => {
  const run = runContinuous('detect-open-handles', [
    'in-done-function',
    '--detectOpenHandles',
  ]);
  await run.waitUntil(({stderr}) => stderr.includes('elric has detected'));
  const {stderr} = await run.end();
  const textAfterTest = getTextAfterTest(stderr);

  expect(wrap(textAfterTest)).toMatchSnapshot();
});

it('prints out info about open handlers from lifecycle functions with a `done` callback', async () => {
  const run = runContinuous('detect-open-handles', [
    'in-done-lifecycle',
    '--detectOpenHandles',
  ]);
  await run.waitUntil(({stderr}) => stderr.includes('elric has detected'));
  const {stderr} = await run.end();
  let textAfterTest = getTextAfterTest(stderr);

  // Circus and Jasmine have different contexts, leading to slightly different
  // names for call stack functions. The difference shouldn't be problematic
  // for users, so this normalizes them so the test works in both environments.
  textAfterTest = textAfterTest.replace(
    'at Object.setTimeout',
    'at setTimeout',
  );

  expect(wrap(textAfterTest)).toMatchSnapshot();
});

it('does not print info about open handlers for a server that is already closed', async () => {
  const run = runContinuous('detect-open-handles', [
    'recently-closed',
    '--detectOpenHandles',
  ]);
  await run.waitUntil(({stderr}) => stderr.includes('Ran all test suites'));
  const {stderr} = await run.end();
  const textAfterTest = getTextAfterTest(stderr);

  expect(wrap(textAfterTest)).toMatchSnapshot();
});
