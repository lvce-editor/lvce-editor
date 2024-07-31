import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const selectIndex = (state, index) => {
  const { editorUid } = state
  return EditorWorker.invoke('EditorCompletion.selectIndex', editorUid, state, index)
}
