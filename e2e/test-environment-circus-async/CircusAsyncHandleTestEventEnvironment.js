/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const JSDOMEnvironment = require('elric-environment-jsdom');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class TestEnvironment extends JSDOMEnvironment {
  async handleTestEvent(event) {
    await this.assertRunnerWaitsForHandleTestEvent(event);

    if (event.hook) {
      console.log(event.name + ': ' + event.hook.type);
    } else if (event.test) {
      console.log(event.name + ': ' + event.test.name);
    } else {
      console.log(event.name);
    }
  }

  async assertRunnerWaitsForHandleTestEvent(event) {
    if (this.pendingEvent) {
      console.log(`warning: ${this.pendingEvent.name} is a sync event`);
    }

    this.pendingEvent = event;
    await sleep(0);
    this.pendingEvent = null;
  }
}

module.exports = TestEnvironment;
