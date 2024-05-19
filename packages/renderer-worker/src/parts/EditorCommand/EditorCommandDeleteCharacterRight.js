import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const deleteCharacterRight = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.deleteCharacterRight', editor)
  return newEditor
}

export const deleteRight = deleteCharacterRight
