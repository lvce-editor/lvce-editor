import * as EmptyMatches from '../EmptyMatches/EmptyMatches.js'
import * as FilterCompletionItem from '../FilterCompletionItem/FilterCompletionItem.js'

const withEmptyMatch = (keyBinding) => {
  return {
    ...keyBinding,
    commandMatches: [],
    keyMatches: [],
  }
}

const withEmptyMatches = (keyBindings) => {
  return keyBindings.map(withEmptyMatch)
}

export const getFilteredKeyBindings = (keyBindings, value) => {
  if (!value) {
    return withEmptyMatches(keyBindings)
  }
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
