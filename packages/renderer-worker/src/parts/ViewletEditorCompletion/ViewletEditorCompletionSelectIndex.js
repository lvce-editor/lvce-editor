import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'

const getInsertSnippet = (word, leadingWord) => {
  if (word.startsWith(leadingWord)) {
    return word.slice(leadingWord.length)
  }
  return word
}

const getEditor = () => {
  return Viewlet.getState('EditorText')
}

const select = async (state, completionItem) => {
  const { leadingWord } = state
  const word = completionItem.label
  const snippet = getInsertSnippet(word, leadingWord)
  // TODO type and dispose commands should be sent to renderer process at the same time
  const editor = getEditor()
  if (editor) {
    editor.completionState = EditorCompletionState.None
  }
  await Command.execute(/* Editor.type */ 'Editor.type', /* text */ snippet)
  await Viewlet.dispose('EditorCompletion')
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
