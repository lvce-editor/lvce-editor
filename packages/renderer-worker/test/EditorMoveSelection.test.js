import * as EditorMoveSelection from '../src/parts/EditorCommand/EditorCommandMoveSelection.js'
import * as EditorMoveSelectionAnchorState from '../src/parts/EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('editorMoveSelection', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  EditorMoveSelectionAnchorState.setPosition({ rowIndex: 0, columnIndex: 1 })
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 2,
      columnIndex: 2,
    }),
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 2, 2),
  })
})

test('editorMoveSelection - to the left', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  EditorMoveSelectionAnchorState.setPosition({
    rowIndex: 0,
    columnIndex: 1,
  })
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 0,
      columnIndex: 0,
    }),
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 0),
  })
})

test('editorMoveSelection - anchor same as cursor position', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  EditorMoveSelectionAnchorState.setPosition({
    rowIndex: 0,
    columnIndex: 1,
  })
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 0,
      columnIndex: 1,
    }),
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test.skip('editorMoveSelection - single line backwards selection', () => {
  const editor = {
    lines: ['line 1'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  EditorMoveSelectionAnchorState.setPosition({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 0,
      columnIndex: 3,
    }),
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 3),
  })
})
