import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorWordPartRight = (editor) => {
  return EditorWorker.invoke('Editor.cursorWordPartRight', editor)
}
