// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const state = {
  listeners: [],
}

// TODO implement typing command without brace completion -> brace completion should be independent module
export const type = async (editor, text) => {
  // if (isBrace(text)) {
  //   console.log('is brace')
  //   return editorTypeWithBraceCompletion(editor, text)
  // }
  // if (isSlash(text)) {
  //   return editorTypeWithSlashCompletion(editor, text)
  // }
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  // // TODO trigger characters should be monomorph -> then skip this check
  // if (
  //   editor.completionTriggerCharacters &&
  //   editor.completionTriggerCharacters.includes(text)
  // ) {
  //   Command.execute(/* EditorCompletion.openFromType */ 988)
  // }

  // TODO should editor type command know about editor completion? -> no
  // EditorCommandCompletion.openFromType(editor, text)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const onDidType = (listener) => {
  state.listeners.push(listener)
  // TODO unregister
}
