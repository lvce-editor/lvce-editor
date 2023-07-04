import * as Character from '../Character/Character.js'
import * as EmptyMatches from '../EmptyMatches/EmptyMatches.js'
import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'

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
  for (const completionItem of completionItems) {
    const { label } = completionItem
    const result = FilterCompletionItem.filterCompletionItem(word, label)
    if (result !== EmptyMatches.EmptyMatches) {
      // TODO avoid mutation
      completionItem.matches = result
      filteredCompletions.push(completionItem)
    }
  }
  return filteredCompletions
}
