import * as EditorCursorLeft from '../src/parts/EditorCommandCursorCharacterLeft/EditorCommandCursorCharacterLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorCharacterLeft - at start', () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - one after start of line', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }

  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - at start of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorCursorCharacterLeft - emoji - 👮🏽‍♀️', () => {
  const columnIndex = '👮🏽‍♀️'.length
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, columnIndex, 0, columnIndex),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - unicode - zero width space', () => {
  const editor = {
    lines: ['\u200B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
