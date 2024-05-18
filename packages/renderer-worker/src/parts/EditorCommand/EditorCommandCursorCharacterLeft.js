import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorCharacterLeft = (editor) => {
  return EditorWorker.invoke('Editor.cursorCharacterLeft', editor)
}

export const cursorLeft = cursorCharacterLeft
