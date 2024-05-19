import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorCharacterRight = (editor) => {
  return EditorWorker.invoke('Editor.cursorCharacterRight', editor)
}

export const cursorRight = cursorCharacterRight
