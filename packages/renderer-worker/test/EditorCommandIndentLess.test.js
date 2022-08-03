import * as EditorIndentLess from '../src/parts/EditorCommandIndentLess/EditorCommandIndentLess.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test.skip('editorIndentLess - already at start of line', () => {
  const editor = {
    lines: ['line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    minLineY: 0,
    lineCache: [],
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorIndentLess - indented by one space', () => {
  const editor = {
    lines: [' line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    minLineY: 0,
    lineCache: [],
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorIndentLess - indented by two spaces', () => {
  const editor = {
    lines: ['  line 1'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    minLineY: 0,
    undoStack: [],
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorIndentLess - indented by tab', () => {
  const editor = {
    lines: ['\tline 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    minLineY: 0,
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
