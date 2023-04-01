import * as Command from '../Command/Command.js'
import * as ReplaceRange from '../EditorCommand/EditorCommandReplaceRange.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getInsertSnippet = (word, leadingWord) => {
  if (word.startsWith(leadingWord)) {
    return word.slice(leadingWord.length)
  }
  return word
}

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

const select = async (state, completionItem) => {
  const { leadingWord } = state
  const word = completionItem.label
  const snippet = getInsertSnippet(word, leadingWord)
  // TODO type and dispose commands should be sent to renderer process at the same time
  const editor = getEditor()
  if (editor) {
    editor.completionState = EditorCompletionState.None
    // TODO remove editor completion from editor widgets
  }
  const { selections } = editor
  const [startRowIndex, startColumnIndex] = selections
  const leadingWordLength = leadingWord.length
  const replaceRange = new Uint32Array([startRowIndex, startColumnIndex - leadingWordLength, startRowIndex, startColumnIndex])
  const changes = ReplaceRange.replaceRange(editor, replaceRange, [word], '')
  await Command.execute(`Editor.applyEdit`, changes)
  await Viewlet.dispose(ViewletModuleId.EditorCompletion)
  return state
}

export const selectIndex = (state, index) => {
  const { items, minLineY } = state
  if (index === -1) {
    return state
  }
  const actualIndex = index + minLineY
  const completionItem = items[actualIndex]
  return select(state, completionItem)
}
