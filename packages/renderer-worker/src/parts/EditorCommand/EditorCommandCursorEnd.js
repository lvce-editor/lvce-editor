import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorEnd = (editor) => {
  return EditorWorker.invoke('Editor.cursorEnd', editor)
}
