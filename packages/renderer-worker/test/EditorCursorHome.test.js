import * as EditorCursorHome from '../src/parts/EditorCommand/EditorCommandCursorHome.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorHome', () => {
  const editor = {
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorHome.editorCursorsHome(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorHome - with indent', () => {
  const editor = {
    lines: ['  aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(EditorCursorHome.editorCursorsHome(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})

test('editorCursorHome - with selection', () => {
  const editor = {
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  expect(EditorCursorHome.editorCursorsHome(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
