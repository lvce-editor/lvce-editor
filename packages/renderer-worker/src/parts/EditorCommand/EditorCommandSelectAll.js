import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectAll = (editor) => {
  return EditorWorker.invoke('Editor.selectAll', editor)
}
