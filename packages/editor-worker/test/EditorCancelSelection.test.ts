import { expect, test } from '@jest/globals'
import * as EditorCancelSelection from '../src/parts/EditorCommand/EditorCommandCancelSelection.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorCancelSelection', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  expect(EditorCancelSelection.cancelSelection(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCancelSelection - when there is no selection', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCancelSelection.cancelSelection(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})
