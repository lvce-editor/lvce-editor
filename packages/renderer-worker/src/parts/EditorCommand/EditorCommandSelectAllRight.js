import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const editorSelectAllRight = (editor) => {
  return EditorWorker.invoke('Editor.selectAllRight', editor)
}
