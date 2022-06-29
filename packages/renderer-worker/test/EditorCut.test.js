import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ClipBoard/ClipBoard.js', () => {
  return {
    writeText: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.js')

const EditorCut = await import('../src/parts/EditorCommand/EditorCommandCut.js')

test('editorCut', async () => {
  // @ts-ignore
  ClipBoard.writeText.mockImplementation(() => {})
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

  expect(ClipBoard.writeText).toHaveBeenCalledTimes(1)
  expect(ClipBoard.writeText).toHaveBeenCalledWith(`ine 2
li`)
})

// TODO handle error gracefully
test('editorCut - error with clipboard', async () => {
  // @ts-ignore
  ClipBoard.writeText.mockImplementation(() => {
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
    undoStack: [],
  }
  await expect(EditorCut.editorCut(editor)).rejects.toThrowError(
    new Error('Writing to clipboard not allowed')
  )
})

test.skip('editorCut - no selection', async () => {
  // @ts-ignore
  ClipBoard.writeText.mockImplementation(() => {})
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
  expect(ClipBoard.writeText).not.toHaveBeenCalled()
})
