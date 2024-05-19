import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const deleteWordRight = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.deleteWordRight', editor)
  return newEditor
}
