import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as Editor from '../src/parts/Editor/Editor.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'

test('create', () => {
  const editor = Editor.create('', '', '', '')
  expect(editor).toBeDefined()
})

test.skip('renderText', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    selections: [],
    invalidStartIndex: 0,
  }
  RendererProcess.state.send = jest.fn()
  Editor.renderText(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.send',
    'EditorText',
    'renderText',
    [
      ['line 1', 'Token Text'],
      ['line 2', 'Token Text'],
    ],
  ])
})

test.skip('renderTextAndCursorAndSelections', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    selections: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    invalidStartIndex: 0,
  }
  RendererProcess.state.send = jest.fn()
  // @ts-ignore
  Editor.renderTextAndCursorAndSelections(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.send',
    'EditorText',
    'renderTextAndCursorAndSelections',
    0,
    28,
    [
      ['line 1', 'Token Text'],
      ['line 2', 'Token Text'],
    ],
    [],
    [],
  ])
})

test('scheduleDocumentAndCursorsSelections', () => {
  RendererProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const editor = {
    lines: ['KEY=42'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    selections: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 9,
      },
      end: {
        rowIndex: 0,
        columnIndex: 9,
      },
      inserted: ['ä'],
      deleted: [],
      origin: EditOrigin.CompositionUpdate,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    lines: ['KEY=42   ä'],
    undoStack: [changes],
  })
  // expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  // expect(RendererProcess.state.send).toHaveBeenCalledWith([
  //   'Viewlet.send',
  //   'EditorText',
  //   'renderTextAndCursorsAndSelections',
  //   0,
  //   28,
  //   [['KEY=42   ä', 'Token Text']],
  //   [{ leftIndex: 0, remainingOffset: 10, topIndex: 0, top: 0 }],
  //   [],
  // ])
})

test('scheduleDocumentAndCursorsSelections - add one character', () => {
  RendererProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const editor = {
    lines: [''],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    selections: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 0,
      },
      inserted: ['a'],
      deleted: [],
      origin: EditOrigin.CompositionUpdate,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    undoStack: [changes],
    lines: ['a'],
  })
  // expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  // expect(RendererProcess.state.send).toHaveBeenCalledWith([
  //   'Viewlet.send',
  //   'EditorText',
  //   'renderTextAndCursorsAndSelections',
  //   0,
  //   28,
  //   [['a', 'Token Text']],
  //   [{ leftIndex: 0, remainingOffset: 1, topIndex: 0, top: 0 }],
  //   [],
  // ])
})

test('scheduleDocumentAndCursorsSelections - delete one character', () => {
  RendererProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const editor = {
    lines: ['a'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    selections: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 1,
      },
      inserted: [''],
      deleted: ['a'],
      origin: EditOrigin.CompositionUpdate,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    undoStack: [changes],
    lines: [''],
  })
  // expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  // expect(RendererProcess.state.send).toHaveBeenCalledWith([
  //   'Viewlet.send',
  //   'EditorText',
  //   'renderTextAndCursorsAndSelections',
  //   0,
  //   28,
  //   [['', 'Token Text']], // TODO empty string doesn't need to be rendered
  //   [{ leftIndex: 0, remainingOffset: 0, topIndex: 0, top: 0 }],
  //   [],
  // ])
})

test('scheduleDocumentAndCursorsSelections - add auto closing bracket', () => {
  const editor = {
    lines: [''],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    selections: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 0,
      },
      inserted: ['{}'],
      deleted: [''],
      origin: EditOrigin.EditorTypeWithAutoClosing,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    lines: ['{}'],
    autoClosingRanges: [0, 1, 0, 1],
  })
})

test('scheduleDocumentAndCursorsSelections - add nested auto closing bracket', () => {
  const editor = {
    lines: ['{}'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
    selections: new Uint32Array([0, 1, 0, 1]),
    autoClosingRanges: [0, 1, 0, 1],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 1,
      },
      end: {
        rowIndex: 0,
        columnIndex: 1,
      },
      inserted: ['{}'],
      deleted: [''],
      origin: EditOrigin.EditorTypeWithAutoClosing,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    lines: ['{{}}'],
    autoClosingRanges: [0, 1, 0, 3, 0, 2, 0, 2],
  })
})

test('scheduleDocumentAndCursorsSelections - insert character, moving auto closing ranges right', () => {
  const editor = {
    lines: ['{}'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
    selections: new Uint32Array([0, 1, 0, 1]),
    autoClosingRanges: [0, 1, 0, 1],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 1,
      },
      end: {
        rowIndex: 0,
        columnIndex: 1,
      },
      inserted: ['a'],
      deleted: [''],
      origin: EditOrigin.EditorType,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    lines: ['{a}'],
    autoClosingRanges: [0, 1, 0, 2],
  })
})

test('scheduleDocumentAndCursorsSelections - delete character, moving auto closing ranges left', () => {
  const editor = {
    lines: ['{a}'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
    selections: new Uint32Array([0, 2, 0, 2]),
    autoClosingRanges: [0, 1, 0, 2],
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 1,
      },
      end: {
        rowIndex: 0,
        columnIndex: 2,
      },
      inserted: [''],
      deleted: ['a'],
      origin: EditOrigin.Delete,
    },
  ]
  expect(Editor.scheduleDocumentAndCursorsSelections(editor, changes)).toMatchObject({
    lines: ['{}'],
    autoClosingRanges: [0, 1, 0, 1],
  })
})
