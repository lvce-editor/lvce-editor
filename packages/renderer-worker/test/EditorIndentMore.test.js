import * as EditorIndentMore from '../src/parts/EditorCommand/EditorCommandIndentMore.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorIndentMore - indent empty selection at start of line', () => {
  const editor = {
    lines: ['line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    minLineY: 0,
    lineCache: [],
    undoStack: [],
  }
  expect(EditorIndentMore.indentMore(editor)).toMatchObject({
    lines: ['  line 1'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})

test.skip('editorIndentMore - indent one selection - single line', async () => {
  const editor = {
    lines: ['line 1'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 6),
    minLineY: 0,
    lineCache: [],
  }
  expect(EditorIndentMore.indentMore(editor)).toMatchObject({
    lines: ['  line 1'],
    selections: EditorSelection.fromRange(0, 2, 0, 8),
  })
})

test.skip('editorIndentMore - indent one selection - multiple lines', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 2, 2),
  }
  expect(EditorIndentMore.indentMore(editor)).toMatchObject({
    lines: ['line 1', '  line 2', '  line 3', 'line 4'],
    selections: EditorSelection.fromRange(1, 3, 2, 4),
  })
})
