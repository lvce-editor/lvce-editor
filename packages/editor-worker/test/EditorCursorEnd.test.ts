import { expect, test } from '@jest/globals'
import * as EditorCursorEnd from '../src/parts/EditorCommand/EditorCommandCursorEnd.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorCursorEnd', () => {
  const editor = {
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('editorCursorEnd - with selection', () => {
  const editor = {
    lines: ['aaaaa'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})
