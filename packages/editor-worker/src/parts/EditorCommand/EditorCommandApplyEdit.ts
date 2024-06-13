// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
import * as Assert from '../Assert/Assert.ts'

// @ts-ignore
export const applyEdit = async (editor, changes) => {
  Assert.object(editor)
  Assert.array(changes)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
