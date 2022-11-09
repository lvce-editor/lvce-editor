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
    const documentEdits = [
      {
        type: /* replace */ 3,
        text: newContent,
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
