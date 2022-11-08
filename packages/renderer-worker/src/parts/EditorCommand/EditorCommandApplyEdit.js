import * as Editor from '../Editor/Editor.js'
import * as Assert from '../Assert/Assert.js'

export const applyEdit = async (editor, changes) => {
  Assert.object(editor)
  Assert.array(changes)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
