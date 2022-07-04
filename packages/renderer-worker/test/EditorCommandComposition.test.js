import { jest } from '@jest/globals'
import * as EditorComposition from '../src/parts/EditorCommand/EditorCommandComposition.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

beforeEach(() => {
  EditorComposition.state.isComposing = false
})

test.skip('editorCompositionStart', () => {
  EditorComposition.editorCompositionStart({}, {})
  expect(EditorComposition.state.isComposing).toBe(true)
})

test.skip('editorCompositionUpdate', () => {
  // TODO
})

test.skip('editorCompositionEnd', () => {
  EditorComposition.state.isComposing = true
  EditorComposition.editorCompositionEnd({})
  expect(EditorComposition.state.isComposing).toBe(false)
})

test('editorComposition - ä', async () => {
  RendererProcess.state.send = jest.fn((message) => {
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
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
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
  const editor2 = EditorComposition.editorCompositionStart(editor, '')
  expect(editor2).toMatchObject({
    lines: [''],
  })
  const editor3 = EditorComposition.editorCompositionUpdate(editor2, '·')
  expect(editor3).toMatchObject({
    lines: ['·'],
  })
  const editor4 = EditorComposition.editorCompositionUpdate(editor3, '"')
  expect(editor4).toMatchObject({
    lines: ['"'],
  })
  const editor5 = EditorComposition.editorCompositionUpdate(editor4, 'ä')
  expect(editor5).toMatchObject({
    lines: ['ä'],
  })
  const editor6 = EditorComposition.editorCompositionEnd(editor5, 'ä')
  expect(editor6).toMatchObject({
    lines: ['ä'],
  })
})

test('editorComposition - ñ', async () => {
  RendererProcess.state.send = jest.fn((message) => {
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
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
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
  // TODO is it possible to make this function without sideeffects? maybe store composition state in editor or in weakmap
  const editor2 = EditorComposition.editorCompositionStart(editor, '')
  expect(editor2).toMatchObject({
    lines: [''],
  })
  const editor3 = EditorComposition.editorCompositionUpdate(editor2, '·')
  expect(editor3).toMatchObject({
    lines: ['·'],
  })
  const editor4 = EditorComposition.editorCompositionUpdate(editor3, '~')
  expect(editor4).toMatchObject({
    lines: ['~'],
  })
  const editor5 = EditorComposition.editorCompositionUpdate(editor4, 'ñ')
  expect(editor5).toMatchObject({
    lines: ['ñ'],
  })
  const editor6 = EditorComposition.editorCompositionEnd(editor5, 'ñ')
  expect(editor6).toMatchObject({
    lines: ['ñ'],
  })
})

test('editorComposition - on and off', async () => {
  RendererProcess.state.send = jest.fn((message) => {
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
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
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
  const editor2 = EditorComposition.editorCompositionStart(editor, '')
  expect(editor2).toMatchObject({
    lines: [''],
  })
  const editor3 = EditorComposition.editorCompositionUpdate(editor2, '·')
  expect(editor3).toMatchObject({
    lines: ['·'],
  })
  const editor4 = EditorComposition.editorCompositionUpdate(editor3, '')
  expect(editor4).toMatchObject({
    lines: [''],
  })
  const editor5 = EditorComposition.editorCompositionEnd(editor4, '')
  expect(editor5).toMatchObject({
    lines: [''],
  })
})
