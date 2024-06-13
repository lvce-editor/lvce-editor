import { expect, test } from '@jest/globals'
import * as EditorDeleteSelection from '../src/parts/EditorCommand/EditorCommandDeleteSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test.skip('editorDeleteSelection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 2,
        },
      },
    ],
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
  }
  EditorDeleteSelection.editorDeleteSelection(editor)
  expect(editor.lines).toEqual(['lne 2'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 1,
  })
})

test('editorDeleteSelection - when there is no selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
  }
  EditorDeleteSelection.editorDeleteSelection(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
