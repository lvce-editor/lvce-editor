import { jest } from '@jest/globals'
import * as ModifierKey from '../src/parts/ModifierKey/ModifierKey.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandPosition.js', () => {
  return {
    at: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const EditorSelection = await import('../src/parts/EditorSelection/EditorSelection.js')

const EditorHandleSingleClick = await import('../src/parts/EditorCommand/EditorCommandHandleSingleClick.js')
const EditorPosition = await import('../src/parts/EditorCommand/EditorCommandPosition.js')

test('editorHandleClick', async () => {
  // @ts-ignore
  EditorPosition.at.mockImplementation(() => {
    return {
      rowIndex: 0,
      columnIndex: 0,
    }
  })
  const editor = {
    lines: ['11111', '22222'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  const { newState } = await EditorHandleSingleClick.handleSingleClick(editor, ModifierKey.None, 21, 11)
  expect(newState).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorHandleClick - with selection', async () => {
  // @ts-ignore
  EditorPosition.at.mockImplementation(() => {
    return {
      rowIndex: 0,
      columnIndex: 0,
    }
  })
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  const { newState } = await EditorHandleSingleClick.handleSingleClick(editor, ModifierKey.None, 21, 11)
  expect(newState).toMatchObject({
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorHandleClick - with ctrl - add second cursor', async () => {
  // @ts-ignore
  EditorPosition.at.mockImplementation(() => {
    return {
      rowIndex: 0,
      columnIndex: 1,
    }
  })
  const editor = {
    lines: ['11111', '22222'],
    selections: new Uint32Array([0, 0, 0, 0]),
    x: 20,
    toy: 10,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  const { newState } = await EditorHandleSingleClick.handleSingleClick(editor, ModifierKey.Ctrl, 21, 11)
  expect(newState).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0, 0, 1, 0, 1]),
  })
})

test('editorHandleClick - with ctrl - remove second cursor', async () => {
  // @ts-ignore
  EditorPosition.at.mockImplementation(() => {
    return {
      rowIndex: 0,
      columnIndex: 1,
    }
  })
  const editor = {
    lines: ['11111', '22222'],
    selections: new Uint32Array([0, 0, 0, 0, 0, 1, 0, 1]),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
    maxLineY: 100,
  }
  const { newState } = await EditorHandleSingleClick.handleSingleClick(editor, ModifierKey.Ctrl, 21, 11)
  expect(newState).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})
