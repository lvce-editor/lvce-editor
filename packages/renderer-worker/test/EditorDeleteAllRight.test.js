import * as EditorDeleteAllRight from '../src/parts/EditorCommand/EditorCommandDeleteAllRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorDeleteAllRight - at start', () => {
  const editor = {
    lines: ['1 2 3 4 5'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteAllRight.deleteAllRight(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteAllRight in middle', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
  }
  const editor = {
    lines: ['1 2 3 4 5'],
    cursor,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteAllRight.deleteAllRight(editor)).toMatchObject({
    lines: ['1 2 3'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})
