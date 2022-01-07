/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {default as BaseWatchPlugin} from './BaseWatchPlugin';
export {default as elricHook} from './elricHooks';
export {default as PatternPrompt} from './PatternPrompt';
export * from './constants';
export type {
  AllowedConfigOptions,
  elricHookEmitter,
  elricHookSubscriber,
  ScrollOptions,
  UpdateConfigCallback,
  UsageData,
  WatchPlugin,
  WatchPluginClass,
} from './types';
export {default as Prompt} from './lib/Prompt';
export * from './lib/patternModeHelpers';
