import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorCopyLineUp from '../src/parts/EditorCommand/EditorCommandCopyLineUp.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'

test.skip('editorCopyLineUp', () => {
  const cursor = {
    rowIndex: 2,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
  }
  EditorCopyLineUp.copyLineUp(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 3'])
  expect(editor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 0,
  })
})
