/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const rimraf = require('rimraf');
const tempy = require('tempy');

const elricDirectory = path.resolve(__dirname, '../packages/elric');

const tsConfig = {
  compilerOptions: {
    esModuleInterop: false,
    lib: ['es2018'],
    module: 'commonjs',
    moduleResolution: 'node',
    noEmit: true,
    strict: true,
    target: 'es5',
  },
};
const cwd = tempy.directory();

const tsVersion = '3.8';

try {
  fs.writeFileSync(path.join(cwd, '.yarnrc.yml'), 'nodeLinker: node-modules\n');
  execa.sync('yarn', ['init', '--yes'], {cwd, stdio: 'inherit'});
  execa.sync('yarn', ['add', `typescript@~${tsVersion}`], {
    cwd,
    stdio: 'inherit',
  });
  fs.writeFileSync(
    path.join(cwd, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2),
  );
  fs.writeFileSync(
    path.join(cwd, 'index.ts'),
    `import elric = require('${elricDirectory}');`,
  );
  execa.sync('yarn', ['tsc', '--project', '.'], {cwd, stdio: 'inherit'});

  console.log(
    chalk.inverse.green(
      ` Successfully compiled elric with TypeScript ${tsVersion} `,
    ),
  );
} finally {
  rimraf.sync(cwd);
}
