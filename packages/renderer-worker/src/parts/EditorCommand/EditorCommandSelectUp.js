import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectUp = (editor) => {
  return EditorWorker.invoke('Editor.selectUp', editor)
}
