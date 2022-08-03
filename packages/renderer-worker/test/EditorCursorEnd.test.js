import * as EditorCursorEnd from '../src/parts/EditorCommandCursorEnd/EditorCommandCursorEnd.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorEnd', () => {
  const editor = {
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorEnd.editorCursorEnd(editor)).toMatchObject({
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
  expect(EditorCursorEnd.editorCursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})
