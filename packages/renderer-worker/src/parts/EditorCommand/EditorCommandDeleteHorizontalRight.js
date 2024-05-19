import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const editorDeleteHorizontalRight = async (editor, deltaId) => {
  const result = await EditorWorker.invoke('Editor.deleteHorizontalRight', editor, deltaId)
  return result
}
