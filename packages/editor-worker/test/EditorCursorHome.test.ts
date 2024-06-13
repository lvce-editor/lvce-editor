import { expect, test } from '@jest/globals'
import * as EditorCursorHome from '../src/parts/EditorCommand/EditorCommandCursorHome.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorCursorHome', () => {
  const editor = {
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorHome.cursorHome(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorHome - with indent', () => {
  const editor = {
    lines: ['  aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(EditorCursorHome.cursorHome(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})

test('editorCursorHome - with selection', () => {
  const editor = {
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  expect(EditorCursorHome.cursorHome(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
