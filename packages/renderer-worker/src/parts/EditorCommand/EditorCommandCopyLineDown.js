import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const copyLineDown = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.copyLineDown', editor)
  return newEditor
}
