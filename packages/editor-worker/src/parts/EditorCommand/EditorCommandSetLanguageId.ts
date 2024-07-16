import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const setLanguageId = async (editor: any, languageId: any) => {
  const { tokenizerId } = editor
  // TODO move tokenizer to syntax highlighting worker
  // TODO only load tokenizer if not already loaded
  // if already loaded just set tokenizer and rerender text
  // TODO race condition
  const newTokenizerId = await RendererWorker.invoke('Tokenizer.loadTokenizer', languageId)
  console.log({ newTokenizerId })
  if (newTokenizerId === editor.tokenizerId) {
    console.log({ same: true })
    return editor
  }
  // TODO update syntax highlighting
  // TODO get edits

  return {
    ...editor,
    languageId,
    invalidStartIndex: 0,
    tokenizerId,
  }
}
