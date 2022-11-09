import * as Editor from '../Editor/Editor.js'
import * as Format from '../Format/Format.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

// TODO only transfer incremental edits from shared process
// TODO also format with cursor
export const format = async (editor) => {
  try {
    const newContent = await Format.format(editor)
    if (typeof newContent !== 'string') {
      console.warn('something is wrong with format on save', newContent)
      return editor
    }
    const { lines } = editor
    const { length } = lines
    const lineLength = lines[length - 1].length
    const documentEdits = [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: length,
          columnIndex: lineLength,
        },
        type: /* replace */ 3,
        inserted: [newContent],
        deleted: [''],
      },
    ]
    return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
  } catch (error) {
    console.error(error)
    const displayErrorMessage = `${error}`
    await EditorShowMessage.editorShowMessage(
      editor,
      0,
      0,
      displayErrorMessage,
      true
    )
    return editor
  }
}
