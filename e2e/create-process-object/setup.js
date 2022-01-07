/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// elric creates a copy of the global 'process' object and uses it instead of the one provided by node.
// Since 'require'-ing the 'domain' module has a side-effect that modifies "process" to make it work with domains,
// 'domain' has to be required before elric performs the copy, i.e. in the global-setup phase represented by this file.

module.exports = () => {
  require('domain');
};
