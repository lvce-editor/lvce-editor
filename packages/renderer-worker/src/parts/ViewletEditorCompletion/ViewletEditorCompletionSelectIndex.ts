import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectIndex = (state, index) => {
  const { editorUid } = state
  return EditorWorker.invoke('EditorCompletion.selectIndex', editorUid, state, index)
}
