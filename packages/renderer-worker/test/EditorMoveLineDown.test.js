import * as EditorMoveLineDown from '../src/parts/EditorCommand/EditorCommandMoveLineDown.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test.skip('editorMoveLineDown', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
    tokenizer: TokenizePlainText,
  }
  EditorMoveLineDown.moveLineDown(editor)
  expect(editor.lines).toEqual(['line 2', 'line 1', 'line 3'])
  expect(editor.cursor).toEqual({
    rowIndex: 1,
    columnIndex: 3,
  })
  EditorMoveLineDown.moveLineDown(editor)
  expect(editor.lines).toEqual(['line 2', 'line 3', 'line 1'])
  expect(editor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 3,
  })
  EditorMoveLineDown.moveLineDown(editor)
  expect(editor.lines).toEqual(['line 2', 'line 3', 'line 1'])
  expect(editor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 3,
  })
})
