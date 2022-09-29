import * as FuzzySearch from '../FuzzySearch/FuzzySearch.js'

export const getFilteredKeyBindings = (keyBindings, value) => {
  const filteredKeyBindings = []
  for (const keyBinding of keyBindings) {
    const { command, key } = keyBinding
    if (
      FuzzySearch.fuzzySearch(value, command) ||
      FuzzySearch.fuzzySearch(value, key)
    ) {
      filteredKeyBindings.push(keyBinding)
    }
  }
  return filteredKeyBindings
}
