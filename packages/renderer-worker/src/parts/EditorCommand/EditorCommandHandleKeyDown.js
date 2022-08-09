import * as Editor from '../Editor/Editor.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as IgnoredKeys from '../IgnoredKeys/IgnoredKeys.js'

export const editorHandleKeyDown = (state, key) => {
  if (IgnoredKeys.isIgnoredKey(key)) {
    return state
  }
  const changes = editorReplaceSelections(state, [key], 'editorHandleKeyDown')
  return Editor.scheduleDocumentAndCursorsSelections(state, changes)
}
