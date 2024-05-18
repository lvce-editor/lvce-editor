import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const editorSelectAllLeft = (editor) => {
  return EditorWorker.invoke('Editor.selectAllLeft', editor)
}
