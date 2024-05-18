import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const deleteAllRight = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.deleteAllRight', editor)
  return newEditor
}
