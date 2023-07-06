import * as EmptyMatches from '../EmptyMatches/EmptyMatches.js'
import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'

export const getFilteredKeyBindings = (keyBindings, value) => {
  const filteredKeyBindings = []
  for (const keyBinding of keyBindings) {
    const { command, key } = keyBinding
    const commandMatches = FilterCompletionItem.filterCompletionItem(value, command)
    const keyMatches = FilterCompletionItem.filterCompletionItem(value, key)
    if (commandMatches !== EmptyMatches.EmptyMatches || keyMatches !== EmptyMatches.EmptyMatches) {
      filteredKeyBindings.push({
        ...keyBinding,
        commandMatches,
        keyMatches,
      })
    }
  }
  return filteredKeyBindings
}
