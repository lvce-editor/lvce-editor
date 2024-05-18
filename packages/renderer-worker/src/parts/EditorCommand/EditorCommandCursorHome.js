import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorHome = (editor) => {
  return EditorWorker.invoke('Editor.cursorHome', editor)
}
