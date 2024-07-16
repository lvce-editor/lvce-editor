import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as ViewletState from '../ViewletStates/ViewletStates.ts'

export const setLanguageId = async (editor: any, languageId: any) => {
  const { uid } = editor
  // TODO only load tokenizer if not already loaded
  // if already loaded just set tokenizer and rerender text
  await Tokenizer.loadTokenizer(languageId)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  if (tokenizer === editor.tokenizer) {
    return editor
  }
  // TODO update syntax highlighting
  // TODO get edits

  const latestEditor = ViewletState.getState(uid)

  return {
    ...latestEditor,
    languageId,
    invalidStartIndex: 0,
    tokenizer,
  }
}
