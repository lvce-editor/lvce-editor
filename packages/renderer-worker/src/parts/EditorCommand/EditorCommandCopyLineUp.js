import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const copyLineUp = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.copyLineUp', editor)
  return newEditor
}
