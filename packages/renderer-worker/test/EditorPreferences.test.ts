/* eslint-disable jest/no-restricted-jest-methods -- Editor preference tests use an ESM module mock. */
import { expect, jest, test } from '@jest/globals'

const getPreference = jest.fn()
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

const EditorPreferences = await import('../src/parts/EditorPreferences/EditorPreferences.js')

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
])('normalizes line height %s/%s to %s', (fontSize, lineHeight, expected) => {
  setFontSizeAndLineHeight(fontSize, lineHeight)

  expect(EditorPreferences.getRowHeight()).toBe(expected)
})
