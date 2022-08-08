import * as Editor from '../Editor/Editor.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const editorHandleKeyDown = (state, key) => {
  const changes = editorReplaceSelections(state, [key], 'editorHandleKeyDown')
  return Editor.scheduleDocumentAndCursorsSelections(state, changes)
}
