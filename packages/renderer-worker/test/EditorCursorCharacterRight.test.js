import * as EditorCursorCharacterRight from '../src/parts/EditorCommand/EditorCommandCursorCharacterRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorCharacterRight', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorCharacterRight.cursorCharacterRight(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(0, 1, 0, 1),
    }
  )
})

test('editorCursorCharacterRight - with selection', () => {
  const editor = {
    lines: ['abc'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }
  expect(EditorCursorCharacterRight.cursorCharacterRight(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(0, 1, 0, 1),
    }
  )
})

test('editorCursorCharacterRight - at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(EditorCursorCharacterRight.cursorCharacterRight(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(1, 0, 1, 0),
    }
  )
})

test('editorCursorCharacterRight - at end of multiple lines', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 6, 1, 6),
  }
  expect(EditorCursorCharacterRight.cursorCharacterRight(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(2, 0, 2, 0),
    }
  )
})

test('editorCursorCharacterRight - emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorCharacterRight.cursorCharacterRight(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(0, 7, 0, 7),
    }
  )
})

test('editorCursorCharacterRight - unicode - zero width space', () => {
  const editor = {
    lines: ['\u200B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorCharacterRight.cursorCharacterRight(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(0, 1, 0, 1),
    }
  )
})
