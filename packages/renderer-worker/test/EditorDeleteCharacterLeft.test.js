import * as EditorDeleteCharacterLeft from '../src/parts/EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorDeleteCharacterLeft', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterLeft - when line is empty', () => {
  const editor = {
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterLeft - merge lines', () => {
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: ['1111122222'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('line below show not disappear', () => {
  const editor = {
    lines: ['11111', '22222', '33333'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 3, 1, 3),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: ['11111', '2222', '33333'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('line below show not disappear 2', () => {
  const editor = {
    lines: ['11111', '22222', '33333'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 5, 1, 5),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: ['11111', '2222', '33333'],
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})

test('editorDeleteCharacterLeft - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

// TODO test merging multiple lines with multiple cursors/selections

test('editorDeleteCharacterLeft - emoji - 👮🏽‍♀️', () => {
  const columnIndex = '👮🏽‍♀️'.length
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, columnIndex, 0, columnIndex),
    undoStack: [],
  }
  expect(EditorDeleteCharacterLeft.deleteCharacterLeft(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
