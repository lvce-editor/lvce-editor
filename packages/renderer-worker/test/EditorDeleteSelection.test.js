import { jest } from '@jest/globals'
import * as EditorDeleteSelection from '../src/parts/EditorCommandDeleteSelection/EditorCommandDeleteSelection.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

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
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
  }
  RendererProcess.state.send = jest.fn()
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
  RendererProcess.state.send = jest.fn()
  EditorDeleteSelection.editorDeleteSelection(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
