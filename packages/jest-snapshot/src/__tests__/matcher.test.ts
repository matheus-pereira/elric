/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import elricSnapshot from '../';

const {toMatchSnapshot} = elricSnapshot;

it(`matcher returns matcher name, expected and actual values`, () => {
  const actual = 'a';
  const expected = 'b';
  const matcher = toMatchSnapshot.bind({
    snapshotState: {
      match: (_testName: string, _received: unknown) => ({actual, expected}),
    },
  });

  const matcherResult = matcher({a: 1});

  expect(matcherResult).toEqual(
    expect.objectContaining({
      actual,
      expected,
      name: 'toMatchSnapshot',
    }),
  );
});
