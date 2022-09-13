import * as EditorSelectCharacterLeft from '../src/parts/EditorCommand/EditorCommandSelectCharacterLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSelectCharacterLeft - single character', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(
    EditorSelectCharacterLeft.editorSelectCharacterLeft(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  })
})

test('editorSelectCharacterLeft - at start of file', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(
    EditorSelectCharacterLeft.editorSelectCharacterLeft(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
