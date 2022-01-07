/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runelric from '../runelric';

test('suite without mock name, mock called', () => {
  const {stderr, exitCode} = runelric('mock-names/without-mock-name');

  expect(exitCode).toBe(0);
  expect(stderr).toMatch(/PASS/);
});

test('suite without mock name, mock not called', () => {
  const {stderr, exitCode} = runelric('mock-names/without-mock-name-not-called');

  expect(exitCode).toBe(1);
  expect(stderr).toMatch(/expect\(elric\.fn\(\)\)\.toHaveBeenCalled/);
});

test('suite with mock name, expect mock not called', () => {
  const {stderr, exitCode} = runelric(
    'mock-names/with-mock-name-not-called-pass',
  );

  expect(exitCode).toBe(0);
  expect(stderr).toMatch(/PASS/);
});

test('suite with mock name, mock called, expect fail', () => {
  const {stderr, exitCode} = runelric(
    'mock-names/with-mock-name-not-called-fail',
  );

  expect(exitCode).toBe(1);
  expect(stderr).toMatch(/expect\(myMockedFunction\)\.not\.toHaveBeenCalled/);
});

test('suite with mock name, mock called 5 times', () => {
  const {stderr, exitCode} = runelric(
    'mock-names/with-mock-name-call-times-pass',
  );

  expect(exitCode).toBe(0);
  expect(stderr).toMatch(/PASS/);
});

test('suite with mock name, mock not called 5 times, expect fail', () => {
  const {stderr, exitCode} = runelric(
    'mock-names/with-mock-name-call-times-fail',
  );

  expect(exitCode).toBe(1);
  expect(stderr).toMatch(/expect\(myMockedFunction\)\.toHaveBeenCalledTimes/);
});

test('suite with mock name, mock called', () => {
  const {stderr, exitCode} = runelric('mock-names/with-mock-name');

  expect(exitCode).toBe(0);
  expect(stderr).toMatch(/PASS/);
});

test('suite with mock name, mock not called', () => {
  const {stderr, exitCode} = runelric('mock-names/with-mock-name-not-called');

  expect(exitCode).toBe(1);
  expect(stderr).toMatch(/expect\(myMockedFunction\)\.toHaveBeenCalled/);
});
