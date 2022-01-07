/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {isPrimitive} from 'elric-get-type';
import {format as pretty} from 'pretty-format';

export type Template = Record<string, unknown>;
export type Templates = Array<Template>;
export type Headings = Array<string>;

export const interpolateVariables = (
  title: string,
  template: Template,
  index: number,
): string =>
  Object.keys(template)
    .reduce(getMatchingKeyPaths(title), []) // aka flatMap
    .reduce(replaceKeyPathWithValue(template), title)
    .replace('$#', '' + index);

const getMatchingKeyPaths =
  (title: string) => (matches: Headings, key: string) =>
    matches.concat(title.match(new RegExp(`\\$${key}[\\.\\w]*`, 'g')) || []);

const replaceKeyPathWithValue =
  (template: Template) => (title: string, match: string) => {
    const keyPath = match.replace('$', '').split('.');
    const value = getPath(template, keyPath);

    if (isPrimitive(value)) {
      return title.replace(match, String(value));
    }
    return title.replace(match, pretty(value, {maxDepth: 1, min: true}));
  };

/* eslint import/export: 0*/
export function getPath<
  Obj extends Template,
  A extends keyof Obj,
  B extends keyof Obj[A],
  C extends keyof Obj[A][B],
  D extends keyof Obj[A][B][C],
  E extends keyof Obj[A][B][C][D],
>(obj: Obj, path: [A, B, C, D, E]): Obj[A][B][C][D][E];
export function getPath<
  Obj extends Template,
  A extends keyof Obj,
  B extends keyof Obj[A],
  C extends keyof Obj[A][B],
  D extends keyof Obj[A][B][C],
>(obj: Obj, path: [A, B, C, D]): Obj[A][B][C][D];
export function getPath<
  Obj extends Template,
  A extends keyof Obj,
  B extends keyof Obj[A],
  C extends keyof Obj[A][B],
>(obj: Obj, path: [A, B, C]): Obj[A][B][C];
export function getPath<
  Obj extends Template,
  A extends keyof Obj,
  B extends keyof Obj[A],
>(obj: Obj, path: [A, B]): Obj[A][B];
export function getPath<Obj extends Template, A extends keyof Obj>(
  obj: Obj,
  path: [A],
): Obj[A];
export function getPath<Obj extends Template>(
  obj: Obj,
  path: Array<string>,
): unknown;
export function getPath(
  template: Template,
  [head, ...tail]: Array<string>,
): unknown {
  if (!head || !template.hasOwnProperty || !template.hasOwnProperty(head))
    return template;
  return getPath(template[head] as Template, tail);
}
