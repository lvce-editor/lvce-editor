import * as EditorMoveLineUp from '../src/parts/EditorCommand/EditorCommandMoveLineUp.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test.skip('editorMoveLineUp', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 2,
      columnIndex: 3,
    },
    tokenizer: TokenizePlainText,
  }
  EditorMoveLineUp.editorMoveLineUp(editor)
  expect(editor.lines).toEqual(['line 1', 'line 3', 'line 2'])
  expect(editor.cursor).toEqual({
    rowIndex: 1,
    columnIndex: 3,
  })
  EditorMoveLineUp.editorMoveLineUp(editor)
  expect(editor.lines).toEqual(['line 3', 'line 1', 'line 2'])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 3,
  })
  EditorMoveLineUp.editorMoveLineUp(editor)
  expect(editor.lines).toEqual(['line 3', 'line 1', 'line 2'])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 3,
  })
})
