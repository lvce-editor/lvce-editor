import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const editorDeleteHorizontalRight = async (editor, deltaId) => {
  const { tokenizer, ...rest } = editor // TODO new tokenizer api
  const newState = await EditorWorker.invoke('Editor.deleteHorizontalRight', rest, deltaId)
  const newEditor = {
    ...newState,
    tokenizer,
  }
  return newEditor
}
