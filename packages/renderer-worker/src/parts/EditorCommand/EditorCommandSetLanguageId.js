import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as Id from '../Id/Id.js'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.js'
import * as ViewletState from '../ViewletStates/ViewletStates.js'

export const setLanguageId = async (editor, languageId) => {
  const { uid } = editor
  // TODO only load tokenizer if not already loaded
  // if already loaded just set tokenizer and rerender text
  await Tokenizer.loadTokenizer(languageId)
  const existing = TokenizerMap.get(editor.tokenizerId)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  console.log('same')
  if (tokenizer === existing) {
    return editor
  }
  console.log('diff', tokenizer)
  // TODO update syntax highlighting
  // TODO get edits

  const latestEditor = ViewletState.getState(uid)
  const tokenizerId = Id.create()
  TokenizerMap.set(tokenizerId, tokenizer)

  return {
    ...latestEditor,
    languageId,
    invalidStartIndex: 0,
    tokenizerId,
  }
}
