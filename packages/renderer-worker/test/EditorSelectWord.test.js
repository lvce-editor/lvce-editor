import * as EditorSelectWord from '../src/parts/EditorCommand/EditorCommandSelectWord.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSelectWord', () => {
  const editor = {
    lines: ['abcde', 'abcde'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 5)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWord - with numbers', () => {
  const editor = {
    lines: ['11111', '22222'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 0)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWord - with umlaut', () => {
  const editor = {
    lines: ['füße'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 0)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWord - with accent', () => {
  const editor = {
    lines: ['tàste'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 0)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWord - with word before', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 3,
  }
  const editor = {
    lines: ['abc   '],
    cursor,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 3)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 3),
  })
})

test('editorSelectWord - with word after', () => {
  const editor = {
    lines: ['   def'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 3)).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 6),
  })
})
