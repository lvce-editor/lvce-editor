import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorWordRight = (editor) => {
  return EditorWorker.invoke('Editor.cursorWordRight', editor)
}
