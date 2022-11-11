import * as EditorCursorDown from '../src/parts/EditorCommand/EditorCommandCursorDown.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorDown', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCursorDown - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 1),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(2, 1, 2, 1),
  })
})

test.skip('editorCursorDown - with emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️', 'abc'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 21, 0, 21),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 3, 1, 3),
  })
})

test('editorCursorDown - line below is shorter', () => {
  const editor = {
    lines: ['abcd', 'a'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})
