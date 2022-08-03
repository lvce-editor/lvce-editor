import * as EditorSelectWordLeft from '../src/parts/EditorCommandSelectWordLeft/EditorCommandSelectWordLeft.js/index.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSelectWordLeft', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorSelectWordLeft.editorSelectWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWordLeft - with umlaut', () => {
  const editor = {
    lines: ['füße'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorSelectWordLeft.editorSelectWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWordLeft - with accent', () => {
  const editor = {
    lines: ['tàste'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  }
  expect(EditorSelectWordLeft.editorSelectWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})
