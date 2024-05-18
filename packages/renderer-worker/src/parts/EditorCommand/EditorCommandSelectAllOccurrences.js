import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectAllOccurrences = (editor) => {
  return EditorWorker.invoke('Editor.selectAllOccurrences', editor)
}
