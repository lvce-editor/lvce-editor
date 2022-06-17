import { jest } from '@jest/globals'
import * as EditorCursorWordRight from '../src/parts/EditorCommand/EditorCommandCursorWordRight.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test.skip('editorCursorWordRight', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['    <title>Document</title>'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  RendererProcess.state.send = jest.fn()
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 10,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 11,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 19,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 26,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 27,
  })
})

test.skip('editorCursorWordRight - with dots', () => {
  const editor = {
    lines: ['this.is.a.test'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
  }
  RendererProcess.state.send = jest.fn()
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 7,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 9,
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 14,
  })
})

test.skip('editorCursorWordRight - with selection', () => {
  const editor = {
    lines: ['<title>Document</title>'],
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
  }
  RendererProcess.state.send = jest.fn()
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 6,
  })
  expect(editor.selections).toEqual([])
})

test.skip('editorCursorWordRight - at end of line', () => {
  const lines = ['line 1', 'line 2']
  const editor = {
    lines,
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [],
  }
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 1,
    columnIndex: 0,
  })
})
