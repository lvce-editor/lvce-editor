import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectCharacterRight = (editor) => {
  return EditorWorker.invoke('Editor.selectCharacterRight', editor)
}
