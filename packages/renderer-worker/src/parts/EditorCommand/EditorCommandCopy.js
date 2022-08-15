import * as Command from '../Command/Command.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'

// TODO add test
export const editorCopy = async (editor) => {
  if (!Editor.hasSelection(editor)) {
    // TODO copy line where cursor is
    return editor
  }
  const selectionStartRowIndex = editor.selections[0]
  const selectionStartColumnIndex = editor.selections[1]
  const selectionEndRowIndex = editor.selections[2]
  const selectionEndColumnIndex = editor.selections[3]
  const range = {
    start: {
      rowIndex: selectionStartRowIndex,
      columnIndex: selectionStartColumnIndex,
    },
    end: {
      rowIndex: selectionEndRowIndex,
      columnIndex: selectionEndColumnIndex,
    },
  }
  const text = TextDocument.getSelectionText(editor, range).join('\n')
  await Command.execute(
    /* ClipBoard.writeText */ 'ClipBoard.writeText',
    /* text */ text
  )
  return editor
}
