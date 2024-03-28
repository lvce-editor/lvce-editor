import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorMoveRectangleSelection from '../src/parts/EditorCommand/EditorCommandMoveRectangleSelection.js'
import * as EditorMoveSelection from '../src/parts/EditorCommand/EditorCommandMoveSelection.js'

test.skip('editorMoveRectangleSelection', () => {
  const editor = {
    lines: ['aaaaa', 'bbbbb', 'ccccc'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [],
    x: 0,
    y: 0,
    rowHeight: 20,
    columnWidth: 8,
  }
  EditorMoveSelection.state.position = {
    rowIndex: 0,
    columnIndex: 2,
  }
  EditorMoveRectangleSelection.moveRectangleSelection(editor, {
    rowIndex: 2,
    columnIndex: 4,
  })
  expect(editor.selections).toEqual([
    {
      end: {
        columnIndex: 4,
        rowIndex: 0,
      },
      start: {
        columnIndex: 2,
        rowIndex: 0,
      },
    },
    {
      end: {
        columnIndex: 4,
        rowIndex: 1,
      },
      start: {
        columnIndex: 2,
        rowIndex: 1,
      },
    },
    {
      end: {
        columnIndex: 4,
        rowIndex: 2,
      },
      start: {
        columnIndex: 2,
        rowIndex: 2,
      },
    },
  ])
})
