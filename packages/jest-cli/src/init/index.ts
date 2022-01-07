/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import chalk = require('chalk');
import * as fs from 'graceful-fs';
import prompts = require('prompts');
import {constants} from 'elric-config';
import {tryRealpath} from 'elric-util';
import {MalformedPackageJsonError, NotFoundPackageJsonError} from './errors';
import generateConfigFile from './generateConfigFile';
import modifyPackageJson from './modifyPackageJson';
import defaultQuestions, {testScriptQuestion} from './questions';
import type {ProjectPackageJson} from './types';

const {
  elric_CONFIG_BASE_NAME,
  elric_CONFIG_EXT_MJS,
  elric_CONFIG_EXT_JS,
  elric_CONFIG_EXT_TS,
  elric_CONFIG_EXT_ORDER,
  PACKAGE_JSON,
} = constants;

type PromptsResults = {
  useTypescript: boolean;
  clearMocks: boolean;
  coverage: boolean;
  coverageProvider: boolean;
  environment: boolean;
  scripts: boolean;
};

const getConfigFilename = (ext: string) => elric_CONFIG_BASE_NAME + ext;

export default async (
  rootDir: string = tryRealpath(process.cwd()),
): Promise<void> => {
  // prerequisite checks
  const projectPackageJsonPath: string = path.join(rootDir, PACKAGE_JSON);

  if (!fs.existsSync(projectPackageJsonPath)) {
    throw new NotFoundPackageJsonError(rootDir);
  }

  const questions = defaultQuestions.slice(0);
  let haselricProperty = false;
  let projectPackageJson: ProjectPackageJson;

  try {
    projectPackageJson = JSON.parse(
      fs.readFileSync(projectPackageJsonPath, 'utf-8'),
    );
  } catch {
    throw new MalformedPackageJsonError(projectPackageJsonPath);
  }

  if (projectPackageJson.elric) {
    haselricProperty = true;
  }

  const existingelricConfigExt = elric_CONFIG_EXT_ORDER.find(ext =>
    fs.existsSync(path.join(rootDir, getConfigFilename(ext))),
  );

  if (haselricProperty || existingelricConfigExt) {
    const result: {continue: boolean} = await prompts({
      initial: true,
      message:
        'It seems that you already have a elric configuration, do you want to override it?',
      name: 'continue',
      type: 'confirm',
    });

    if (!result.continue) {
      console.log();
      console.log('Aborting...');
      return;
    }
  }

  // Add test script installation only if needed
  if (
    !projectPackageJson.scripts ||
    projectPackageJson.scripts.test !== 'elric'
  ) {
    questions.unshift(testScriptQuestion);
  }

  // Start the init process
  console.log();
  console.log(
    chalk.underline(
      `The following questions will help elric to create a suitable configuration for your project\n`,
    ),
  );

  let promptAborted = false;

  // @ts-expect-error: Return type cannot be object - faulty typings
  const results: PromptsResults = await prompts(questions, {
    onCancel: () => {
      promptAborted = true;
    },
  });

  if (promptAborted) {
    console.log();
    console.log('Aborting...');
    return;
  }

  // Determine if elric should use JS or TS for the config file
  const elricConfigFileExt = results.useTypescript
    ? elric_CONFIG_EXT_TS
    : projectPackageJson.type === 'module'
    ? elric_CONFIG_EXT_MJS
    : elric_CONFIG_EXT_JS;

  // Determine elric config path
  const elricConfigPath = existingelricConfigExt
    ? getConfigFilename(existingelricConfigExt)
    : path.join(rootDir, getConfigFilename(elricConfigFileExt));

  const shouldModifyScripts = results.scripts;

  if (shouldModifyScripts || haselricProperty) {
    const modifiedPackageJson = modifyPackageJson({
      projectPackageJson,
      shouldModifyScripts,
    });

    fs.writeFileSync(projectPackageJsonPath, modifiedPackageJson);

    console.log('');
    console.log(`✏️  Modified ${chalk.cyan(projectPackageJsonPath)}`);
  }

  const generatedConfig = generateConfigFile(
    results,
    projectPackageJson.type === 'module' ||
      elricConfigPath.endsWith(elric_CONFIG_EXT_MJS),
  );

  fs.writeFileSync(elricConfigPath, generatedConfig);

  console.log('');
  console.log(
    `📝  Configuration file created at ${chalk.cyan(elricConfigPath)}`,
  );
};
