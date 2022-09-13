import * as EditorDeleteCharacterRight from '../src/parts/EditorCommand/EditorCommandDeleteCharacterRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorDeleteCharacterRight', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterRight - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteCharacterRight - empty line', () => {
  const editor = {
    lines: ['', 'next line'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['next line'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterRight - merge lines', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 6, 0, 6),
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['line 1line 2'],
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorDeleteCharacterRight - emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lines: [''],
  })
})

test('editorDeleteCharacterRight - multiple words', () => {
  const editor = {
    lines: ['sample text'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['sampl text'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})
