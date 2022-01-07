/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import exit = require('exit');
import type {
  SerializableError,
  TestFileEvent,
  TestResult,
} from '@elric/test-result';
import type {Config} from '@elric/types';
import HasteMap, {SerializableModuleMap} from 'elric-haste-map';
import {separateMessageFromStack} from 'elric-message-util';
import type Resolver from 'elric-resolve';
import Runtime from 'elric-runtime';
import {messageParent} from 'elric-worker';
import runTest from './runTest';
import type {ErrorWithCode, TestRunnerSerializedContext} from './types';

export type SerializableResolver = {
  config: Config.ProjectConfig;
  serializableModuleMap: SerializableModuleMap;
};

type WorkerData = {
  config: Config.ProjectConfig;
  globalConfig: Config.GlobalConfig;
  path: Config.Path;
  context?: TestRunnerSerializedContext;
};

// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  exit(1);
});

const formatError = (error: string | ErrorWithCode): SerializableError => {
  if (typeof error === 'string') {
    const {message, stack} = separateMessageFromStack(error);
    return {
      message,
      stack,
      type: 'Error',
    };
  }

  return {
    code: error.code || undefined,
    message: error.message,
    stack: error.stack,
    type: 'Error',
  };
};

const resolvers = new Map<string, Resolver>();
const getResolver = (config: Config.ProjectConfig) => {
  const resolver = resolvers.get(config.name);
  if (!resolver) {
    throw new Error('Cannot find resolver for: ' + config.name);
  }
  return resolver;
};

export function setup(setupData: {
  serializableResolvers: Array<SerializableResolver>;
}): void {
  // Module maps that will be needed for the test runs are passed.
  for (const {
    config,
    serializableModuleMap,
  } of setupData.serializableResolvers) {
    const moduleMap = HasteMap.getStatic(config).getModuleMapFromJSON(
      serializableModuleMap,
    );
    resolvers.set(config.name, Runtime.createResolver(config, moduleMap));
  }
}

const sendMessageToelric: TestFileEvent = (eventName, args) => {
  messageParent([eventName, args]);
};

export async function worker({
  config,
  globalConfig,
  path,
  context,
}: WorkerData): Promise<TestResult> {
  try {
    return await runTest(
      path,
      globalConfig,
      config,
      getResolver(config),
      context && {
        ...context,
        changedFiles: context.changedFiles && new Set(context.changedFiles),
        sourcesRelatedToTestsInChangedFiles:
          context.sourcesRelatedToTestsInChangedFiles &&
          new Set(context.sourcesRelatedToTestsInChangedFiles),
      },
      sendMessageToelric,
    );
  } catch (error: any) {
    throw formatError(error);
  }
}
