/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ProjectPackageJson} from './types';

const modifyPackageJson = ({
  projectPackageJson,
  shouldModifyScripts,
}: {
  projectPackageJson: ProjectPackageJson;
  shouldModifyScripts: boolean;
}): string => {
  if (shouldModifyScripts) {
    projectPackageJson.scripts
      ? (projectPackageJson.scripts.test = 'elric')
      : (projectPackageJson.scripts = {test: 'elric'});
  }

  delete projectPackageJson.elric;

  return JSON.stringify(projectPackageJson, null, 2) + '\n';
};

export default modifyPackageJson;
