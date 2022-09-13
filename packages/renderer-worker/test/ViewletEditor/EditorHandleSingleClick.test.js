import { jest } from '@jest/globals'
import * as ModifierKey from '../src/parts/ModifierKey/ModifierKey.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const EditorSelection = await import(
  '../src/parts/EditorSelection/EditorSelection.js'
)

const EditorHandleSingleClick = await import(
  '../src/parts/EditorCommand/EditorCommandHandleSingleClick.js'
)

test('editorHandleClick', async () => {
  const editor = {
    lines: ['11111', '22222'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  expect(
    await EditorHandleSingleClick.editorHandleSingleClick(editor, '', 21, 11, 0)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorHandleClick - with selection', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  expect(
    await EditorHandleSingleClick.editorHandleSingleClick(editor, '', 21, 11, 0)
  ).toMatchObject({
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorHandleClick - with ctrl - add second cursor', async () => {
  const editor = {
    lines: ['11111', '22222'],
    selections: new Uint32Array([0, 0, 0, 0]),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  expect(
    await EditorHandleSingleClick.editorHandleSingleClick(
      editor,
      ModifierKey.Ctrl,
      21,
      11,
      1
    )
  ).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0, 0, 1, 0, 1]),
  })
})

test('editorHandleClick - with ctrl - remove second cursor', async () => {
  const editor = {
    lines: ['11111', '22222'],
    selections: new Uint32Array([0, 0, 0, 0, 0, 1, 0, 1]),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    deltaY: 0,
  }
  expect(
    await EditorHandleSingleClick.editorHandleSingleClick(
      editor,
      ModifierKey.Ctrl,
      21,
      11,
      1
    )
  ).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})
