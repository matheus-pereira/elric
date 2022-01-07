/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let oldIsTTY: typeof process.stdout.isTTY;
let oldTERM: string | undefined;

beforeEach(() => {
  oldIsTTY = process.stdout.isTTY;
  oldTERM = process.env.TERM;
});

afterEach(() => {
  process.stdout.isTTY = oldIsTTY;
  process.env.TERM = oldTERM;
  elric.resetModules();
});

it('Returns true when running on interactive environment', () => {
  elric.doMock('ci-info', () => ({isCI: false}));
  process.stdout.isTTY = true;
  process.env.TERM = 'xterm-256color';

  const isInteractive = require('../isInteractive').default;
  expect(isInteractive).toBe(true);
});

it('Returns false when running on a non-interactive environment', () => {
  let isInteractive;
  const expectedResult = false;

  // Test with isCI being true and isTTY false
  elric.doMock('ci-info', () => ({isCI: true}));
  process.stdout.isTTY = undefined;
  process.env.TERM = 'xterm-256color';
  isInteractive = require('../isInteractive').default;
  expect(isInteractive).toBe(expectedResult);

  // Test with isCI being false and isTTY false
  elric.resetModules();
  elric.doMock('ci-info', () => ({isCI: false}));
  process.stdout.isTTY = undefined;
  process.env.TERM = 'xterm-256color';
  isInteractive = require('../isInteractive').default;
  expect(isInteractive).toBe(expectedResult);

  // Test with isCI being true and isTTY true
  elric.resetModules();
  elric.doMock('ci-info', () => ({isCI: true}));
  process.stdout.isTTY = true;
  process.env.TERM = 'xterm-256color';
  isInteractive = require('../isInteractive').default;
  expect(isInteractive).toBe(expectedResult);

  // Test with dumb terminal
  elric.resetModules();
  elric.doMock('ci-info', () => ({isCI: false}));
  process.stdout.isTTY = undefined;
  process.env.TERM = 'dumb';
  isInteractive = require('../isInteractive').default;
  expect(isInteractive).toBe(expectedResult);
});
