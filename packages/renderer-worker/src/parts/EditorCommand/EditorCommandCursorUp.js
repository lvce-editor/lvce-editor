import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorUp = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.cursorUp', editor)
  return newEditor
}
