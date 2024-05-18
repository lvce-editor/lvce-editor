import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorDown = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.cursorDown', editor)
  return newEditor
}
