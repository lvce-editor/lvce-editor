import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorWordPartLeft = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.cursorWordPartLeft', editor)
  return newEditor
}
