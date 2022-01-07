/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {KEYS} from '../../constants';
import Prompt from '../Prompt';

it('calls handler on change value', () => {
  const options = {max: 10, offset: -1};
  const prompt = new Prompt();
  const onChange = elric.fn();

  prompt.enter(onChange, elric.fn(), elric.fn());

  expect(onChange).toHaveBeenLastCalledWith('', options);

  prompt.put('t');
  expect(onChange).toHaveBeenLastCalledWith('t', options);

  prompt.put('e');
  expect(onChange).toHaveBeenLastCalledWith('te', options);

  prompt.put('s');
  expect(onChange).toHaveBeenLastCalledWith('tes', options);

  prompt.put('t');
  expect(onChange).toHaveBeenLastCalledWith('test', options);

  expect(onChange).toHaveBeenCalledTimes(5);
});

it('calls handler on success prompt', () => {
  const prompt = new Prompt();
  const onSuccess = elric.fn();

  prompt.enter(elric.fn(), onSuccess, elric.fn());

  prompt.put('t');
  prompt.put('e');
  prompt.put('s');
  prompt.put('t');
  prompt.put(KEYS.ENTER);

  expect(onSuccess).toHaveBeenCalledWith('test');
});

it('calls handler on cancel prompt', () => {
  const prompt = new Prompt();
  const onCancel = elric.fn();

  prompt.enter(elric.fn(), elric.fn(), onCancel);

  prompt.put('t');
  prompt.put('e');
  prompt.put('s');
  prompt.put('t');
  prompt.put(KEYS.ESCAPE);

  expect(onCancel).toHaveBeenCalled();
});

it('clears the line when CONTROL_U is pressed', () => {
  const prompt = new Prompt();
  const onChange = elric.fn();
  const options = {max: 10, offset: -1};

  prompt.enter(onChange, elric.fn(), elric.fn());

  prompt.put('t');
  prompt.put('e');
  prompt.put('s');
  prompt.put('t');
  expect(onChange).toHaveBeenLastCalledWith('test', options);

  prompt.put(KEYS.CONTROL_U);
  expect(onChange).toHaveBeenLastCalledWith('', options);
});
