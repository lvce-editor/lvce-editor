import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as ViewletState from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const setLanguageId = async (editor, languageId) => {
  const { uid } = editor
  // TODO only load tokenizer if not already loaded
  // if already loaded just set tokenizer and rerender text
  await Tokenizer.loadTokenizer(languageId)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  if (tokenizer === editor.tokenizer) {
    return ViewletState.getState(uid)
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
