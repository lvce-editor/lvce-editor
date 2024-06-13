import { beforeEach, expect, jest, test } from '@jest/globals'
import * as EditorComposition from '../src/parts/EditorCommand/EditorCommandComposition.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

beforeEach(() => {
  EditorComposition.state.isComposing = false
})

test.skip('editorCompositionStart', () => {
  EditorComposition.compositionStart({}, {})
  expect(EditorComposition.state.isComposing).toBe(true)
})

test.skip('editorCompositionUpdate', () => {
  // TODO
})

test.skip('editorCompositionEnd', () => {
  EditorComposition.state.isComposing = true
  EditorComposition.compositionEnd({}, {})
  expect(EditorComposition.state.isComposing).toBe(false)
})

test.skip('editorComposition - ä', async () => {
  // @ts-ignore
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
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  const editor2 = EditorComposition.compositionStart(editor, '')
  expect(editor2).toMatchObject({
    lines: [''],
  })
  const editor3 = EditorComposition.compositionUpdate(editor2, '·')
  expect(editor3).toMatchObject({
    lines: ['·'],
  })
  const editor4 = EditorComposition.compositionUpdate(editor3, '"')
  expect(editor4).toMatchObject({
    lines: ['"'],
  })
  const editor5 = EditorComposition.compositionUpdate(editor4, 'ä')
  expect(editor5).toMatchObject({
    lines: ['ä'],
  })
  const editor6 = EditorComposition.compositionEnd(editor5, 'ä')
  expect(editor6).toMatchObject({
    lines: ['ä'],
  })
})

test.skip('editorComposition - ñ', async () => {
  // @ts-ignore
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
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  // TODO is it possible to make this function without sideeffects? maybe store composition state in editor or in weakmap
  const editor2 = EditorComposition.compositionStart(editor, '')
  expect(editor2).toMatchObject({
    lines: [''],
  })
  const editor3 = EditorComposition.compositionUpdate(editor2, '·')
  expect(editor3).toMatchObject({
    lines: ['·'],
  })
  const editor4 = EditorComposition.compositionUpdate(editor3, '~')
  expect(editor4).toMatchObject({
    lines: ['~'],
  })
  const editor5 = EditorComposition.compositionUpdate(editor4, 'ñ')
  expect(editor5).toMatchObject({
    lines: ['ñ'],
  })
  const editor6 = EditorComposition.compositionEnd(editor5, 'ñ')
  expect(editor6).toMatchObject({
    lines: ['ñ'],
  })
})

test.skip('editorComposition - on and off', async () => {
  // @ts-ignore
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
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
    undoStack: [],
  }
  const editor2 = EditorComposition.compositionStart(editor, '')
  expect(editor2).toMatchObject({
    lines: [''],
  })
  const editor3 = EditorComposition.compositionUpdate(editor2, '·')
  expect(editor3).toMatchObject({
    lines: ['·'],
  })
  const editor4 = EditorComposition.compositionUpdate(editor3, '')
  expect(editor4).toMatchObject({
    lines: [''],
  })
  const editor5 = EditorComposition.compositionEnd(editor4, '')
  expect(editor5).toMatchObject({
    lines: [''],
  })
})
