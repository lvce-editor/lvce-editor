import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const cursorWordLeft = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.cursorWordLeft', editor)
  return newEditor
}
