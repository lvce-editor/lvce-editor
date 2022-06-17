import { jest } from '@jest/globals'
import * as ClipBoard from '../src/parts/ClipBoard/ClipBoard.js'
import * as EditorCut from '../src/parts/EditorCommand/EditorCommandCut.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorCut', async () => {
  ClipBoard.state.writeText = jest.fn(async () => {})
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 2,
        },
      },
    ],
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorCut.editorCut(editor)).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 1,
        },
      },
    ],
    lines: ['line 1', 'lne 3', ''],
  })

  expect(ClipBoard.state.writeText).toHaveBeenCalledTimes(1)
  expect(ClipBoard.state.writeText).toHaveBeenCalledWith(`ine 2
li`)
})

// TODO handle error gracefully
test('editorCut - error with clipboard', async () => {
  ClipBoard.state.writeText = jest.fn(() => {
    throw new Error('Writing to clipboard not allowed')
  })
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 2,
        },
      },
    ],
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  await expect(EditorCut.editorCut(editor)).rejects.toThrowError(
    new Error('Writing to clipboard not allowed')
  )
})

test.skip('editorCut - no selection', async () => {
  ClipBoard.state.writeText = jest.fn(async () => {})
  const cursor = {
    rowIndex: 1,
    columnIndex: 1,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(await EditorCut.editorCut(editor)).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 1,
        },
      },
    ],
    lines: ['line 1', 'line 2', 'line 3', ''],
  })
  expect(ClipBoard.state.writeText).not.toHaveBeenCalled()
})
