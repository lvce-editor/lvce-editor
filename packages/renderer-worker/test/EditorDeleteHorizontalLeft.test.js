import * as EditorDeleteHorizontalLeft from '../src/parts/EditorCommandDeleteHorizontalLeft/EditorCommandDeleteHorizontalLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorDeleteCharacterHorizontalLeft - single character - no selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
  }
  expect(
    EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, () => 1)
  ).toMatchObject({
    lines: ['ine 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterHorizontalLeft - multiple selections', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4]),
    undoStack: [],
  }
  expect(
    EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, () => 1)
  ).toMatchObject({
    lines: [' 1', ' 2'],
    selections: EditorSelection.fromRanges([0, 0, 0, 0], [1, 0, 1, 0]),
  })
})

// TODO test merging multiple lines with multiple cursors/selections
