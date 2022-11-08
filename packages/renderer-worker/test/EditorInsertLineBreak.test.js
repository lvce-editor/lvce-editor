import * as EditorInsertLineBreak from '../src/parts/EditorCommand/EditorCommandInsertLineBreak.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorInsertLineBreak', () => {
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['', '11111', '22222'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorInsertLineBreak - in middle', () => {
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 2, 0, 2),
    undoStack: [],
  }
  expect(EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['11', '111', '22222'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorInsertLineBreak - with whitespace at start', () => {
  const editor = {
    lines: ['    11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 2, 0, 2),
    undoStack: [],
  }
  expect(EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['  ', '    11111', '22222'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('editorInsertLineBreak - with selection', () => {
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 2),
    undoStack: [],
  }
  expect(EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['', '111', '22222'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorInsertLineBreak - cursor at end of line', () => {
  const editor = {
    lines: ['    11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 9, 0, 9),
    undoStack: [],
  }
  expect(EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['    11111', '    ', '22222'],
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})
