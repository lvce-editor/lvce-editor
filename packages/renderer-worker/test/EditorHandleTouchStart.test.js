import * as EditorHandleTouchStart from '../src/parts/EditorCommand/EditorCommandHandleTouchStart.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'
import * as EditorMoveSelection from '../src/parts/EditorCommand/EditorCommandMoveSelection.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test.skip('editorHandleTouchStart - no touches', () => {
  const editor = {
    lines: ['11111', '22222'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  EditorHandleTouchStart.handleTouchStart(editor, [])
  expect(EditorMoveSelection.state.position).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})

test('editorHandleTouchStart - single touch', () => {
  const editor = {
    lines: ['11111', '22222'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  EditorHandleTouchStart.handleTouchStart(editor, {
    touches: [{ x: 45, y: 35 }],
  })
  expect(EditorHandleTouchStart.state).toEqual({
    deltaY: 0,
    touchOffsetY: 35,
  })
})
