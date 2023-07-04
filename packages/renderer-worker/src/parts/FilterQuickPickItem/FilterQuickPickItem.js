import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'

export const Empty = []

export const filterQuickPickItem = (pattern, word) => {
  return FilterCompletionItem.filterCompletionItem(pattern, word)
}
