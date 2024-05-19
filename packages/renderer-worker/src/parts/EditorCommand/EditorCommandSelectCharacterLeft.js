import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const selectCharacterLeft = (editor) => {
  return EditorWorker.invoke('Editor.selectCharacterLeft', editor)
}
