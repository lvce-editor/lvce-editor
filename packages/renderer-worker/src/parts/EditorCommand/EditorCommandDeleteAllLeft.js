import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const deleteAllLeft = (editor) => {
  return EditorWorker.invoke('Editor.deleteAllLeft', editor)
}
