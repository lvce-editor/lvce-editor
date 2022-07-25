import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const setLanguageId = async (editor, languageId) => {
  // TODO only load tokenizer if not already loaded
  // if already loaded just set tokenizer and rerender text
  await Tokenizer.loadTokenizer(languageId)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  if (tokenizer === editor.tokenizer) {
    return Viewlet.state.instances.EditorText.state
  }
  // TODO update syntax highlighting
  // TODO get edits

  const latestEditor = Viewlet.state.instances.EditorText.state

  return {
    ...latestEditor,
    languageId,
    invalidStartIndex: 0,
    tokenizer,
  }
}
