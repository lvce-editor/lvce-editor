import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const selectCurrent = (state) => {
  const { editorUid } = state
  return EditorWorker.invoke('EditorCompletion.selectCurrent', editorUid, state)
}
