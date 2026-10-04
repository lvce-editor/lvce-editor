/* eslint-disable jest/no-restricted-jest-methods -- Editor preference tests use an ESM module mock. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const getPreference = jest.fn()
const warn = jest.fn()
const setFontSizeAndLineHeight = (fontSize: number, lineHeight: unknown): void => {
  getPreference.mockImplementation((key) => {
    if (key === 'editor.fontSize') {
      return fontSize
    }
    if (key === 'editor.lineHeight') {
      return lineHeight
    }
    return undefined
  })
}

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
}))
jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({ warn }))

const EditorPreferences = await import('../src/parts/EditorPreferences/EditorPreferences.js')

beforeEach(() => {
  warn.mockReset()
})

test('reads the documented auto-closing brackets setting', () => {
  getPreference.mockReturnValue(true)

  expect(EditorPreferences.isAutoClosingBracketsEnabled()).toBe(true)
  expect(getPreference).toHaveBeenCalledWith('editor.autoClosingBrackets')
})

test.each([
  [18, 10, 18],
  [18, 18, 18],
  [18, 24, 24],
  [18, 0, 18],
  [18, -1, 18],
  [18, '10', 18],
  [18, 'invalid', 18],
  [18, null, 18],
  [18, NaN, 18],
  [18, Infinity, 18],
  [18, 200, 100],
])('normalizes line height %s/%s to %s', (fontSize, lineHeight, expected) => {
  setFontSizeAndLineHeight(fontSize, lineHeight)

  expect(EditorPreferences.getRowHeight()).toBe(expected)
})

test.each([
  [9, 10],
  [10, 10],
  [18, 18],
  [100, 100],
  [101, 100],
])('normalizes font size %s to %s', (fontSize, expected) => {
  getPreference.mockReturnValue(fontSize)

  expect(EditorPreferences.getFontSize()).toBe(expected)
})

test('normalizes font size from supplied preferences', () => {
  expect(EditorPreferences.getFontSize({ 'editor.fontSize': 120 })).toBe(100)
  expect(EditorPreferences.getRowHeight({ 'editor.fontSize': 120, 'editor.lineHeight': 200 })).toBe(100)
})

test('uses the default for non-numeric and non-finite font sizes', () => {
  for (const fontSize of ['12', 'invalid', null, NaN, Infinity]) {
    getPreference.mockReturnValue(fontSize)
    expect(EditorPreferences.getFontSize()).toBe(15)
  }
})

test('warns with the supplied setting value and applied bound', () => {
  setFontSizeAndLineHeight(18, 202)

  expect(EditorPreferences.getRowHeight()).toBe(100)
  expect(warn).toHaveBeenCalledWith('[renderer-worker] editor.lineHeight value 202 is too large; using 100')
})

test('warns when explicit line height is below the font size', () => {
  setFontSizeAndLineHeight(18, 12)

  expect(EditorPreferences.getRowHeight()).toBe(18)
  expect(warn).toHaveBeenCalledWith('[renderer-worker] editor.lineHeight value 12 is too small; using 18')
})

test('warns about small font sizes and reports changed settings', () => {
  getPreference.mockReturnValue(8)
  expect(EditorPreferences.getFontSize()).toBe(10)
  getPreference.mockReturnValue(9)
  expect(EditorPreferences.getFontSize()).toBe(10)

  expect(warn).toHaveBeenCalledTimes(2)
  expect(warn).toHaveBeenNthCalledWith(1, '[renderer-worker] editor.fontSize value 8 is too small; using 10')
  expect(warn).toHaveBeenNthCalledWith(2, '[renderer-worker] editor.fontSize value 9 is too small; using 10')
})
