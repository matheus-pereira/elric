/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {wrap} from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

describe('Stack Trace', () => {
  it('prints a stack trace for runtime errors', () => {
    const {exitCode, stderr} = runelric('stack-trace', ['runtimeError.test.js']);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();

    expect(exitCode).toBe(1);
    expect(stderr).toMatch(
      /ReferenceError: thisIsARuntimeError is not defined/,
    );
    expect(stderr).toMatch(/> 10 \| thisIsARuntimeError\(\);/);
    expect(stderr).toMatch(
      /\s+at\s(?:.+?)\s\(__tests__\/runtimeError.test\.js/,
    );
  });

  it('does not print a stack trace for runtime errors when --noStackTrace is given', () => {
    const {exitCode, stderr} = runelric('stack-trace', [
      'runtimeError.test.js',
      '--noStackTrace',
    ]);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();
    expect(exitCode).toBe(1);

    expect(stderr).toMatch(
      /ReferenceError: thisIsARuntimeError is not defined/,
    );
    expect(stderr).not.toMatch(
      /\s+at\s(?:.+?)\s\(__tests__\/runtimeError.test\.js/,
    );
  });

  it('prints a stack trace for matching errors', () => {
    const {exitCode, stderr} = runelric('stack-trace', ['stackTrace.test.js']);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();
    expect(exitCode).toBe(1);

    expect(stderr).toMatch(/\s+at\s(?:.+?)\s\(__tests__\/stackTrace.test\.js/);
  });

  it('does not print a stack trace for matching errors when --noStackTrace is given', () => {
    const {exitCode, stderr} = runelric('stack-trace', [
      'stackTrace.test.js',
      '--noStackTrace',
    ]);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();
    expect(exitCode).toBe(1);

    expect(stderr).not.toMatch(
      /\s+at\s(?:.+?)\s\(__tests__\/stackTrace.test\.js/,
    );
  });

  it('prints a stack trace for errors', () => {
    const {exitCode, stderr} = runelric('stack-trace', ['testError.test.js']);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();
    expect(exitCode).toBe(1);

    expect(stderr).toMatch(/this is unexpected\./);
    expect(stderr).toMatch(/this is a string\./);

    expect(stderr).toMatch(/\s+at\s(?:.+?)\s\(__tests__\/testError.test\.js/);

    // Make sure we show elric's elric-resolve as part of the stack trace
    expect(stderr).toMatch(
      /Cannot find module 'this-module-does-not-exist' from '__tests__\/testError\.test\.js'/,
    );

    expect(stderr).toMatch(
      /\s+at\s(?:.+?)\s\((?:.+?)elric-resolve\/build\/resolver\.js/,
    );
  });

  it('prints a stack trace for errors without message in stack trace', () => {
    const {exitCode, stderr} = runelric('stack-trace', [
      'stackTraceWithoutMessage.test.js',
    ]);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();
    expect(exitCode).toBe(1);

    expect(stderr).toMatch(/important message/);
    expect(stderr).toMatch(
      /\s+at\s(?:.+?)\s\(__tests__\/stackTraceWithoutMessage.test\.js/,
    );
  });

  it('does not print a stack trace for errors when --noStackTrace is given', () => {
    const {exitCode, stderr} = runelric('stack-trace', [
      'testError.test.js',
      '--noStackTrace',
    ]);

    expect(wrap(extractSummary(stderr).summary)).toMatchSnapshot();
    expect(exitCode).toBe(1);

    expect(stderr).not.toMatch(
      /\s+at\s(?:.+?)\s\(__tests__\/testError.test\.js/,
    );
  });
});
