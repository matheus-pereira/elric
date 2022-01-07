/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {wrap} from 'elric-snapshot-serializer-raw';
import slash = require('slash');
import {extractSummary} from '../Utils';
import runelric from '../runelric';

const MULTIPLE_CONFIGS_WARNING_TEXT = 'Multiple configurations found';

test('multiple configs will warn', () => {
  const rootDir = slash(path.resolve(__dirname, '../..'));
  const {exitCode, stderr} = runelric('multiple-configs', [], {
    skipPkgJsonCheck: true,
  });

  expect(exitCode).toBe(0);
  expect(stderr).toContain(MULTIPLE_CONFIGS_WARNING_TEXT);

  const cleanStdErr = stderr.replace(new RegExp(rootDir, 'g'), '<rootDir>');
  const {rest, summary} = extractSummary(cleanStdErr);

  expect(wrap(rest)).toMatchSnapshot();
  expect(wrap(summary)).toMatchSnapshot();
});

test('multiple configs warning can be suppressed by using --config', () => {
  const {exitCode, stderr} = runelric(
    'multiple-configs',
    ['--config', 'elric.config.json'],
    {
      skipPkgJsonCheck: true,
    },
  );

  expect(exitCode).toBe(0);
  expect(stderr).not.toContain(MULTIPLE_CONFIGS_WARNING_TEXT);
});
