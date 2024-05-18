import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectDown = (editor) => {
  return EditorWorker.invoke('Editor.selectDown', editor)
}
