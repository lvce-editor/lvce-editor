import * as Command from '../Command/Command.js'

const getInsertSnippet = (word, leadingWord) => {
  if (word.startsWith(leadingWord)) {
    return word.slice(leadingWord.length)
  }
  return word
}

const select = async (state, completionItem) => {
  const { leadingWord } = state
  const word = completionItem.label
  const snippet = getInsertSnippet(word, leadingWord)
  // TODO type and dispose commands should be sent to renderer process at the same time
  await Command.execute(/* Editor.type */ 'Editor.type', /* text */ snippet)
  return {
    ...state,
    disposed: true,
  }
}

export const selectIndex = (state, index) => {
  const completionItem = state.filteredItems[index]
  return select(state, completionItem)
}
