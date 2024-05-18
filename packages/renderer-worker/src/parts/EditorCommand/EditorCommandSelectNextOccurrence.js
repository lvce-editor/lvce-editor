import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectNextOccurrence = (editor) => {
  return EditorWorker.invoke('Editor.selectNextOccurrence', editor)
}
