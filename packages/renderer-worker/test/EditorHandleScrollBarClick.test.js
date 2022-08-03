import { jest } from '@jest/globals'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// TODO jest unstable_mockModule doesn't seem to work anymore after upgrade from jest 27 to jest 28

jest.unstable_mockModule('../src/parts/Editor/Editor.js', () => {
  return {
    setDeltaYFixedValue(editor, value) {
      const newDeltaY = clamp(value, 0, editor.finalDeltaY)
      if (editor.deltaY === newDeltaY) {
        return
      }
      editor.deltaY = newDeltaY
      const newLineY = Math.floor(newDeltaY / 20)
      if (editor.minLineY === newLineY) {
        return
      }
      editor.minLineY = newLineY
      editor.maxLineY = editor.minLineY + editor.numberOfVisibleLines
    },
  }
})

const EditorHandleScrollBarClick = await import(
  '../src/parts/EditorCommandHandleScrollBarClick/EditorCommandHandleScrollBarClick.js'
)

test.skip('editorHandleScrollBarClick - in middle', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
    top: TOP,
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    scrollBarHeight: 40,
  }
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 200)
  expect(editor.deltaY).toBe(400)
})

test.skip('editorHandleScrollBarClick - at bottom', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    top: TOP,
    scrollBarHeight: 40,
  }
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 400)
  expect(editor.deltaY).toBe(800)
  expect(EditorHandleScrollBarClick.state.handleOffset).toBe(20)
})

test.skip('editorHandleScrollBarClick - almost at bottom', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    top: TOP,
    scrollBarHeight: 40,
  }
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 370)
  expect(editor.deltaY).toBeCloseTo(777.777) // (370 / max) * height
  expect(EditorHandleScrollBarClick.state.handleOffset).toBe(20)
})

test.skip('editorHandleScrollBarClick - below scrollbar', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    top: TOP,
    scrollBarHeight: 40,
  }
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 0)
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 200)
  expect(editor.deltaY).toBeCloseTo(400) // TODO
  expect(EditorHandleScrollBarClick.state.handleOffset).toBe(20) // TODO
})

// TODO test clicking almost at the top while in middle
// TODO test clicking at the top  while in middle
// TODO test clicking in other middle while in middle
// TODO test clicking almost at the top while almost at top
// TODO test clicking at the top  while at top
// TODO test clicking at the bottom while at bottom
// TODO test clicking at the bottom while in middle
// TODO test clicking at close to the bottom while in middle
// TODO test clicking at close to the bottom while close to the bottom
