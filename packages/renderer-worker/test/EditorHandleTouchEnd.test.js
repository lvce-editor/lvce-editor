import { jest } from '@jest/globals'
import * as EditorHandleTouchEnd from '../src/parts/EditorCommand/EditorCommandHandleTouchEnd.js'
import * as EditorHandleTouchMove from '../src/parts/EditorCommand/EditorCommandHandleTouchMove.js'
import * as EditorHandleTouchStart from '../src/parts/EditorCommand/EditorCommandHandleTouchStart.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'

test.skip('editorHandleTouchEnd - selection was moved', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  EditorHandleTouchStart.handleTouchStart(editor, {
    touches: [{ x: 45, y: 35 }],
  })
  EditorHandleTouchMove.handleTouchMove(editor, {
    touches: [{ x: 60, y: 60 }],
  })
  EditorHandleTouchEnd.handleTouchEnd(editor, {
    changedTouches: [{ x: 60, y: 60 }],
  })
  expect(editor.selections).toEqual([
    {
      end: {
        columnIndex: 5,
        rowIndex: 5,
      },
      start: {
        columnIndex: 3,
        rowIndex: 2,
      },
    },
  ])
})

test.skip('editorHandleTouchEnd - short tap should set cursor position', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  EditorHandleTouchStart.handleTouchStart(editor, {
    touches: [{ x: 45, y: 15 }],
  })
  EditorHandleTouchEnd.handleTouchEnd(editor, {
    changedTouches: [{ x: 45, y: 15 }],
  })
})

test.skip('editorHandleTouchEnd - long tap should select word', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))
  console.log(new Date())
  EditorHandleTouchStart.handleTouchStart(editor, {
    touches: [{ x: 45, y: 15 }],
  })
  jest.useFakeTimers().advanceTimersByTime(151)
  EditorHandleTouchEnd.handleTouchEnd(editor, {
    changedTouches: [{ x: 45, y: 15 }],
  })
})
