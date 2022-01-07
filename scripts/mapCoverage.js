/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Because we have a build step, sometimes we can test files from both
 * `packages/elric-whatever/build/*` and `packages/elric-whatever/src/*`
 *
 * If we require file by its relative path like:
 *    // inside `elric-whatever/src/__tests__/index.js`
 *    require('../index.js'); // this will require `elric-whatever/src/index.js`
 *
 * But if we require it by a package name, this will go through node_modules
 * and lerna index.js link. So the actual file will be required from `build/`
 *    // inside another packages
 *    // this will go through lerna and require `elric-whatever/build/index.js
 *    require('elric-whatever')
 *
 * these files are identical (one is preprocessed, another is transformed on
 * the fly), but the coverage paths are different.
 * This script will map coverage results from both locations to one and
 * produce a full coverage report.
 */

const istanbulCoverage = require('istanbul-lib-coverage');
const istanbulReport = require('istanbul-lib-report');
const istanbulReports = require('istanbul-reports');
const coverage = require('../coverage/coverage-final.json');

const map = istanbulCoverage.createCoverageMap();

const mapFileCoverage = fileCoverage => {
  fileCoverage.path = fileCoverage.path.replace(
    /(.*packages\/.*\/)(build)(\/.*)/,
    '$1src$3',
  );
  return fileCoverage;
};

Object.keys(coverage).forEach(filename =>
  map.addFileCoverage(mapFileCoverage(coverage[filename])),
);

const context = istanbulReport.createContext({coverageMap: map});

['json', 'lcov', 'text'].forEach(reporter =>
  istanbulReports.create(reporter, {}).execute(context),
);
