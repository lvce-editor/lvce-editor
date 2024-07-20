import * as Character from '../Character/Character.js'
import * as EmptyMatches from '../EmptyMatches/EmptyMatches.ts'
import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'
import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.js'

const addEmptyMatch = (item) => {
  return {
    ...item,
    matches: EmptyMatches.EmptyMatches,
  }
}

export const filterCompletionItems = (completionItems, word) => {
  if (word === Character.EmptyString) {
    return completionItems.map(addEmptyMatch)
  }
  const filteredCompletions = []
  const deprecated = []
  for (const completionItem of completionItems) {
    const { label, flags } = completionItem
    const result = FilterCompletionItem.filterCompletionItem(word, label)
    if (result !== EmptyMatches.EmptyMatches) {
      if (flags & CompletionItemFlags.Deprecated) {
        // TODO avoid mutation
        completionItem.matches = EmptyMatches.EmptyMatches
        deprecated.push(completionItem)
      } else {
        // TODO avoid mutation
        completionItem.matches = result
        filteredCompletions.push(completionItem)
      }
    }
  }
  if (deprecated.length > 0) {
    filteredCompletions.push(...deprecated)
  }
  return filteredCompletions
}
