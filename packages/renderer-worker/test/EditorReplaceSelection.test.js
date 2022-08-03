import * as Editor from '../src/parts/Editor/Editor.js'
import * as EditorReplaceSelection from '../src/parts/EditorCommandReplaceSelection/EditorCommandReplaceSelection.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('replaceSelection - virtual space insertion', () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    undoStack: [],
  }
  const changes = EditorReplaceSelection.editorReplaceSelections(
    editor,
    ['a'],
    ''
  )
  expect(
    Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  ).toMatchObject({
    lines: ['     a'],
  })
})
