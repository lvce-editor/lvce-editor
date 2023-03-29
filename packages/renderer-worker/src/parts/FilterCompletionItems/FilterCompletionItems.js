import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'

export const filterCompletionItems = (completionItems, word) => {
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
