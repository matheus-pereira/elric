/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import wrap from 'elric-snapshot-serializer-raw';
import {extractSummary} from '../Utils';
import runelric from '../runelric';

function assertFailuresAndSnapshot(args: Array<string>) {
  const result = runelric('wrong-env', args);
  expect(result.exitCode).toBe(1);
  expect(wrap(extractSummary(result.stderr).rest)).toMatchSnapshot();
}

describe('Wrong globals for environment', () => {
  it('print useful error for window', () => {
    assertFailuresAndSnapshot(['node', '-t=window']);
  });

  it('print useful error for document', () => {
    assertFailuresAndSnapshot(['node', '-t=document']);
  });

  it('print useful error for navigator', () => {
    assertFailuresAndSnapshot(['node', '-t=navigator']);
  });

  it('print useful error for unref', () => {
    assertFailuresAndSnapshot(['jsdom', '-t=unref']);
  });

  it('print useful error when it explodes during evaluation', () => {
    assertFailuresAndSnapshot(['beforeTest']);
  });
});
