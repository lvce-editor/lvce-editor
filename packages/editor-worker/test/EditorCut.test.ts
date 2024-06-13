import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ClipBoard/ClipBoard.ts', () => {
  return {
    writeText: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.ts', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.ts')
const EditorCut = await import('../src/parts/EditorCommand/EditorCommandCut.ts')
const EditorSelection = await import('../src/parts/EditorSelection/EditorSelection.ts')

test.skip('editorCut', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorCut.cut(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    lines: ['line 1', 'lne 3', ''],
  })

  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ClipBoard.writeText',
    `ine 2
li`,
  )
})

// TODO handle error gracefully
test.skip('editorCut - error with clipboard', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    throw new Error('Writing to clipboard not allowed')
  })
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  await expect(EditorCut.cut(editor)).rejects.toThrow(new Error('Writing to clipboard not allowed'))
})

test.skip('editorCut - no selection', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 1, 1),
  }
  expect(await EditorCut.cut(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 1, 1, 1),
    lines: ['line 1', 'line 2', 'line 3', ''],
  })
  expect(Command.execute).not.toHaveBeenCalled()
})
