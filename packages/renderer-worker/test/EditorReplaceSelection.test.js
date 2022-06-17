import * as Editor from '../src/parts/Editor/Editor.js'
import * as EditorReplaceSelection from '../src/parts/EditorCommand/EditorCommandReplaceSelection.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('replaceSelection - virtual space insertion', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
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
