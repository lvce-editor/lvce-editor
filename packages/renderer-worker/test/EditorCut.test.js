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

const EditorSelection = await import(
  '../src/parts/EditorSelection/EditorSelection.js'
)

test('editorCut', async () => {
  // @ts-ignore
  ClipBoard.writeText.mockImplementation(() => {})
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorCut.editorCut(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 1, 1, 1),
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
    selections: EditorSelection.fromRange(1, 1, 2, 2),
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
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 1, 1),
  }
  expect(await EditorCut.editorCut(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 1, 1, 1),
    lines: ['line 1', 'line 2', 'line 3', ''],
  })
  expect(ClipBoard.writeText).not.toHaveBeenCalled()
})
