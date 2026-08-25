/* eslint-disable jest/no-restricted-jest-methods -- Editor preference tests use an ESM module mock. */
import { expect, jest, test } from '@jest/globals'

const getPreference = jest.fn()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
}))

const EditorPreferences = await import('../src/parts/EditorPreferences/EditorPreferences.js')

test('reads the documented auto-closing brackets setting', () => {
  getPreference.mockReturnValue(true)

  expect(EditorPreferences.isAutoClosingBracketsEnabled()).toBe(true)
  expect(getPreference).toHaveBeenCalledWith('editor.autoClosingBrackets')
})
