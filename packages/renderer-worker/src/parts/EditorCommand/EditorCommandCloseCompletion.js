import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const closeCompletion = async (editor) => {
  editor.completionState = EditorCompletionState.None
  const instance = ViewletStates.getInstance('EditorCompletion')
  if (!instance) {
    return
  }
  await Viewlet.dispose('EditorCompletion')
  return editor
}
