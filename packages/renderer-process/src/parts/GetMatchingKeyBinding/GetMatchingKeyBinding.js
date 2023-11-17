import * as Context from '../Context/Context.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'

const matchesContext = (keybinding) => {
  if (!keybinding.when) {
    return true
  }
  return Context.get(keybinding.when)
}

export const getMatchingKeyBinding = (identifier) => {
  // TODO this could be more efficient in O(N) instead of O(2N)
  const matchesIdentifier = (keyBinding) => {
    return keyBinding.key === identifier
  }
  const keyBindings = KeyBindingsState.getKeyBindings()
  const matchingKeyBindings = keyBindings.filter(matchesIdentifier)
  const matchingKeyBinding = matchingKeyBindings.find(matchesContext)
  return matchingKeyBinding
}
