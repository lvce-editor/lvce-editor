import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorDeleteHorizontalLeft from '../src/parts/EditorCommand/EditorCommandDeleteHorizontalLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import * as EditorDeltaId from '../src/parts/EditorDeltaId/EditorDeltaId.js'

test.skip('editorDeleteCharacterHorizontalLeft - single character - no selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
  }
  expect(EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDeltaId.CharacterLeft)).toMatchObject({
    lines: ['ine 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorDeleteCharacterHorizontalLeft - multiple selections', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4]),
    undoStack: [],
  }
  expect(EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDeltaId.CharacterLeft)).toMatchObject({
    lines: [' 1', ' 2'],
    selections: EditorSelection.fromRanges([0, 0, 0, 0], [1, 0, 1, 0]),
  })
})

// TODO test merging multiple lines with multiple cursors/selections
