/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {tmpdir} from 'os';
import * as path from 'path';
import type {Config} from '@elric/types';
import {tryRealpath} from 'elric-util';

const getCacheDirectory: () => Config.Path = () => {
  const {getuid} = process;
  const tmpdirPath = path.join(tryRealpath(tmpdir()), 'elric');
  if (getuid == null) {
    return tmpdirPath;
  } else {
    // On some platforms tmpdir() is `/tmp`, causing conflicts between different
    // users and permission issues. Adding an additional subdivision by UID can
    // help.
    return `${tmpdirPath}_${getuid.call(process).toString(36)}`;
  }
};

export default getCacheDirectory;
