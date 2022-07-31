import * as EditorDeleteWordLeft from '../src/parts/EditorCommand/EditorCommandDeleteWordLeft.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorDeleteWordLeft', () => {
  const editor = {
    lines: ['sample text'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 11, 0, 11),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['sample '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test('editorDeleteWordLeft - merge lines', () => {
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['1111122222'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test.skip('editorDeleteWordLeft - no word left', () => {
  const editor = {
    lines: ['1   '],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteWordLeft - at start of line', () => {
  const editor = {
    lines: ['1', '2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['12'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteWordLeft - at start of file', () => {
  const editor = {
    lines: ['1', '2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['1', '2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
