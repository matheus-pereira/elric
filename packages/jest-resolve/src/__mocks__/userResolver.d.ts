/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import defaultResolver from '../defaultResolver';

// todo: can be replaced with elric.MockedFunction
declare const userResolver: elric.MockInstance<
  ReturnType<typeof defaultResolver>,
  Parameters<typeof defaultResolver>
>;

export default userResolver;
