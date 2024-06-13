// @ts-ignore
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.ts'
// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.ts'
// @ts-ignore
import * as ViewletStates from '../ViewletStates/ViewletStates.ts'

// @ts-ignore
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
