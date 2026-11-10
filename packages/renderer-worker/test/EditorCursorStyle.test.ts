import { expect, test } from '@jest/globals'
import { getDynamicCss } from '../src/parts/ViewletEditorText/ViewletEditorTextCss.js'

test('cursor style preference selects a character-wide translucent block or the default line', () => {
  expect(getDynamicCss({ 'editor.cursorStyle': 'block' })).toContain('--EditorCursorWidth: 1ch')
  expect(getDynamicCss({ 'editor.cursorStyle': 'block' })).toContain('--EditorCursorOpacity: 0.5')
  expect(getDynamicCss({ 'editor.cursorStyle': 'line' })).toContain('--EditorCursorWidth: 2px')
  expect(getDynamicCss({})).toContain('--EditorCursorOpacity: 1')
})
