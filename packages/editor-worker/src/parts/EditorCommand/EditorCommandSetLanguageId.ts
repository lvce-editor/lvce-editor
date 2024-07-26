import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

// TODO add command to set language id
// without needing to specify tokenizePath
export const setLanguageId = async (editor: any, languageId: string, tokenizePath: string) => {
  const { tokenizerId } = editor
  // TODO move tokenizer to syntax highlighting worker
  // TODO only load tokenizer if not already loaded
  // if already loaded just set tokenizer and rerender text
  // TODO race condition
  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const newTokenizerId = tokenizerId + 1
  TokenizerMap.set(newTokenizerId, tokenizer)

  const latest = GetEditor.getEditor(editor.uid)
  if (!latest) {
    return editor
  }
  // TODO don't update editor if tokenizer was already loaded
  // TODO update syntax highlighting
  // TODO get edits

  return {
    ...latest,
    languageId,
    invalidStartIndex: 0,
    tokenizerId: newTokenizerId,
  }
}
