import * as EditorCursorUp from '../src/parts/EditorCommandCursorUp/EditorCommandCursorUp.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorUp - at start of file', () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorUp - one line below top', () => {
  const editor = {
    lines: ['', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorUp - with selection', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorCursorUp - with emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['abc', '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 21, 1, 21),
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
})

test.skip('editorCursorUp - line above is shorter', () => {
  const editor = {
    lines: ['a', 'abcd'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1), // TODO with virtual space, this would be 0,4
  })
})
