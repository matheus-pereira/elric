/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import glob = require('glob');
import slash = require('slash');
import type {Config} from '@elric/types';

const OUTSIDE_elric_VM_PROTOCOL = 'elric-main:';
// String manipulation is easier here, fileURLToPath is only in newer Nodes,
// plus setting non-standard protocols on URL objects is difficult.
export const createOutsideelricVmPath = (path: string): string =>
  OUTSIDE_elric_VM_PROTOCOL + '//' + encodeURIComponent(path);
export const decodePossibleOutsideelricVmPath = (
  outsideelricVmPath: string,
): string | undefined => {
  if (outsideelricVmPath.startsWith(OUTSIDE_elric_VM_PROTOCOL)) {
    return decodeURIComponent(
      outsideelricVmPath.replace(
        new RegExp('^' + OUTSIDE_elric_VM_PROTOCOL + '//'),
        '',
      ),
    );
  }
  return undefined;
};

export const findSiblingsWithFileExtension = (
  moduleFileExtensions: Config.ProjectConfig['moduleFileExtensions'],
  from: Config.Path,
  moduleName: string,
): string => {
  if (!path.isAbsolute(moduleName) && path.extname(moduleName) === '') {
    const dirname = path.dirname(from);
    const pathToModule = path.resolve(dirname, moduleName);

    try {
      const slashedDirname = slash(dirname);

      const matches = glob
        .sync(`${pathToModule}.*`)
        .map(match => slash(match))
        .map(match => {
          const relativePath = path.posix.relative(slashedDirname, match);

          return path.posix.dirname(match) === slashedDirname
            ? `./${relativePath}`
            : relativePath;
        })
        .map(match => `\t'${match}'`)
        .join('\n');

      if (matches) {
        const foundMessage = `\n\nHowever, elric was able to find:\n${matches}`;

        const mappedModuleFileExtensions = moduleFileExtensions
          .map(ext => `'${ext}'`)
          .join(', ');

        return (
          foundMessage +
          "\n\nYou might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently " +
          `[${mappedModuleFileExtensions}].\n\nSee https://elricjs.io/docs/configuration#modulefileextensions-arraystring`
        );
      }
    } catch {}
  }

  return '';
};
