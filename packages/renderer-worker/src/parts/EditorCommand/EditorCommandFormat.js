import * as Editor from '../Editor/Editor.js'
import * as Format from '../Format/Format.js'

// TODO only transfer incremental edits from shared process
// TODO also format with cursor
export const format = async (editor) => {
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
}
