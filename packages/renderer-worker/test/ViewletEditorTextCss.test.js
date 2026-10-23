import { expect, test } from '@jest/globals'
import * as ViewletEditorTextCss from '../src/parts/ViewletEditorText/ViewletEditorTextCss.js'

test('editor typography css matches the defaults used for text measurement', () => {
  const css = ViewletEditorTextCss.getDynamicCss({})
  expect(css).toContain('--EditorFontSize: 15px')
  expect(css).toContain('--EditorFontFamily: Fira Code')
  expect(css).toContain('--EditorFontWeight: 400')
  expect(css).toContain('--EditorLetterSpacing: 0.5px')
  expect(css).toContain('--EditorTabSize: 2')
})

test('editor typography css preserves configured preferences', () => {
  const css = ViewletEditorTextCss.getDynamicCss({
    'editor.fontSize': 13,
    'editor.fontFamily': 'monospace',
    'editor.fontWeight': 500,
    'editor.letterSpacing': 1,
    'editor.tabSize': 4,
  })
  expect(css).toContain('--EditorFontSize: 13px')
  expect(css).toContain('--EditorFontFamily: monospace')
  expect(css).toContain('--EditorFontWeight: 500')
  expect(css).toContain('--EditorLetterSpacing: 1px')
  expect(css).toContain('--EditorTabSize: 4')
})
