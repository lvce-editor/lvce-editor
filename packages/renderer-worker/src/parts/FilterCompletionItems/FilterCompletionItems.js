import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'

const addEmptyMatch = (item) => {
  return {
    ...item,
    matches: FilterCompletionItem.Empty,
  }
}

export const filterCompletionItems = (completionItems, word) => {
  if (word === '') {
    return completionItems.map(addEmptyMatch)
  }
  const filteredCompletions = []
  for (const completionItem of completionItems) {
    const { label } = completionItem
    const result = FilterCompletionItem.filterCompletionItem(word, label)
    if (result !== FilterCompletionItem.Empty) {
      // TODO avoid mutation
      completionItem.matches = result
      filteredCompletions.push(completionItem)
    }
  }
  return filteredCompletions
}
