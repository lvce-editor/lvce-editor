import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectCurrent = (state) => {
  const { editorUid } = state
  return EditorWorker.invoke('EditorCompletion.selectCurrent', editorUid, state)
}
