import { jest } from '@jest/globals'
import * as EditorSelection from '../src/parts/Editor/EditorSelection.js'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorScrolling from '../src/parts/Editor/EditorScrolling.js'

// TODO jest unstable_mockModule doesn't seem to work anymore after upgrade from jest 27 to jest 28

jest.unstable_mockModule('../src/parts/Editor/Editor.js', () => {
  return {
    scheduleDocumentAndSelections(editor, changes) {
      TextDocument.applyEdits(editor.textDocument, changes)
      EditorSelection.applyEdit(editor, changes)
    },
    setDeltaYFixedValue(editor, value) {
      EditorScrolling.setDeltaY(editor, value)
    },
  }
})

const EditorHandleScrollBarMove = await import(
  '../src/parts/EditorCommandHandleScrollBarMove/EditorCommandHandleScrollBarMove.js'
)

const EditorHandleScrollBarClick = await import(
  '../src/parts/EditorCommandHandleScrollBarClick/EditorCommandHandleScrollBarClick.js'
)

test.skip('editorHandleScrollBarMove', () => {
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
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 184)
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 184)
  EditorHandleScrollBarMove.editorHandleScrollBarMove(editor, 190)
  expect(editor.deltaY).toBeCloseTo(377.777)
})

test.skip('editorHandleScrollBarMove - another test', () => {
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
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 0)
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 34)
  EditorHandleScrollBarMove.editorHandleScrollBarMove(editor, 36)
  expect(editor.deltaY).toBe(0)
})

test.skip('editorHandleScrollBarMove - click scroll bar at top and move down', () => {
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
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 200) // position scrollbar at [180, 220]
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 180) // sets click offset to 0
  EditorHandleScrollBarMove.editorHandleScrollBarMove(editor, 184) // moves down 4 pixels
  expect(editor.deltaY).toBeCloseTo(408.888) // ((180 + 4) / 360) * 800
})

test.skip('editorHandleScrollBarMove - click scroll bar in middle and move down', () => {
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
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 200) // position scrollbar at [180, 220]
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 200) // sets click offset to 20
  EditorHandleScrollBarMove.editorHandleScrollBarMove(editor, 202) // moves down 2 pixels
  expect(editor.deltaY).toBeCloseTo(404.444) // ((180 + 2) / 360) * 800
})

test.skip('editorHandleScrollBarMove - click scroll bar at bottom and move down', () => {
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
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 200) // position scrollbar at [180, 220]
  EditorHandleScrollBarClick.editorHandleScrollBarClick(editor, 219) // sets click offset to 39
  EditorHandleScrollBarMove.editorHandleScrollBarMove(editor, 222) // moves down 3 pixels
  expect(editor.deltaY).toBeCloseTo(406.666) // ((180 + 3) / 360) * 800
})

// TODO test scrolling all the way to the top
// TODO test scrolling all the way to the bottom

// TODO test scrolling up from top (noop)
// TODO test scrolling down from top

// TODO test scrolling up from bottom
// TODO test scrolling down from bottom (noop)
