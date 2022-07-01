import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const editorCut = async (editor) => {
  const selection = editor.selections[0]
  if (selection.start === selection.end) {
    // TODO cut line where cursor is
  } else {
    // cut selection
  }
  const changes = editorReplaceSelections(editor, [''], 'editorCut')
  const text = changes[0].deleted.join('\n')
  // TODO remove selected text from document
  await Command.execute(
    /* ClipBoard.writeText */ 'ClipBoard.writeText',
    /* text */ text
  )
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
