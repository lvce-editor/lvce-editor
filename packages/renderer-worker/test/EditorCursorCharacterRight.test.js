import * as EditorCursorCharacterRight from '../src/parts/EditorCommandCursorCharacterRight/EditorCommandCursorCharacterRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorCharacterRight', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorCursorCharacterRight - with selection', () => {
  const editor = {
    lines: ['abc'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test.skip('editorCursorCharacterRight - at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCursorCharacterRight - emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test('editorCursorCharacterRight - unicode - zero width space', () => {
  const editor = {
    lines: ['\u200B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})
