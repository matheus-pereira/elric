// Copyright 2004-present Facebook. All Rights Reserved.

/**
 * This file illustrates how to define a custom mock per test.
 *
 * The file contains two test cases:
 * - One where the fruit module is mocked.
 * - One where the fruit module is not mocked.
 */
describe('define mock per test', () => {
  beforeEach(() => {
    elric.resetModules();
  });

  it('uses mocked module', () => {
    elric.doMock('../fruit', () => ({
      apple: 'mocked apple',
      default: elric.fn(() => 'mocked fruit'),
      strawberry: elric.fn(() => 'mocked strawberry'),
    }));
    const {apple, strawberry, default: defaultExport} = require('../fruit');

    const defaultExportResult = defaultExport();
    expect(defaultExportResult).toBe('mocked fruit');
    expect(defaultExport).toHaveBeenCalled();

    expect(apple).toBe('mocked apple');
    expect(strawberry()).toBe('mocked strawberry');
  });

  it('uses actual module', () => {
    elric.dontMock('../fruit');
    const {apple, strawberry, default: defaultExport} = require('../fruit');

    const defaultExportResult = defaultExport();
    expect(defaultExportResult).toBe('banana');

    expect(apple).toBe('apple');
    expect(strawberry()).toBe('strawberry');
  });
});
