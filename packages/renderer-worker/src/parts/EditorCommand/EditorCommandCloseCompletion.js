import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const closeCompletion = async (editor) => {
  const completionUid = editor.completionUid
  const instance = ViewletStates.getInstance(completionUid)
  editor.completionState = EditorCompletionState.None
  editor.completionUid = 0
  if (!instance) {
    return editor
  }
  await Viewlet.dispose(completionUid)
  return editor
}
