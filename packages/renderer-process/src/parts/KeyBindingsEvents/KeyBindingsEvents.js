import * as Context from '../Context/Context.js'
import * as Event from '../Event/Event.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const normalizeKey = (key) => {
  if (key === ' ') {
    return 'Space'
  }
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

const getIdentifier = (event) => {
  let identifier = ''
  if (event.ctrlKey) {
    identifier += 'ctrl+'
  }
  if (event.shiftKey) {
    identifier += 'shift+'
  }
  if (event.altKey) {
    identifier += 'alt+'
  }
  const key = normalizeKey(event.key)
  identifier += key
  return identifier
}

// TODO store keybindings as json somewhere

// TODO sort keybindings by `when` priority -> focus.editorCompletions: 10, focus.editor:9 etc.

// TODO does it make sense to have all of these configurable?
// could remove some context logic and have less user configuration when these are default
// e.g. arrow down focuses next, arrow up always focuses previous item (like in aria spec)

// TODO ui should only have keys -> commands get resolved inside renderer worker
// TODO should toggle terminal, not only open

const matchesContext = (keybinding) => {
  if (!keybinding.when) {
    return true
  }
  return Context.get(keybinding.when)
}

const getMatchingKeyBinding = (identifier) => {
  // TODO this could be more efficient in O(N) instead of O(2N)
  const matchesIdentifier = (keyBinding) => {
    return keyBinding.key === identifier
  }
  const keyBindings = KeyBindingsState.getKeyBindings()
  const matchingKeyBindings = keyBindings.filter(matchesIdentifier)
  const matchingKeyBinding = matchingKeyBindings.find(matchesContext)
  return matchingKeyBinding
}

const getModifier = (event) => {
  switch (event.key) {
    case 'Control':
      return 'ctrl'
    case 'Shift':
      return 'shift'
    case 'Alt':
      return 'alt'
  }
  return ''
}

const clearModifier = () => {
  if (!KeyBindingsState.hasModifier()) {
    return
  }
  if (KeyBindingsState.getModifierTimeout() !== -1) {
    clearTimeout(KeyBindingsState.getModifierTimeout())
    KeyBindingsState.setModifier('')
    KeyBindingsState.setModifierTimeout(-1)
  }
}

const handleMatchingKeyBinding = (matchingKeyBinding) => {
  // TODO execute command directly or -> executeCommand -> keybindings -> executeCommand
  // better directly
  // TODO always should be number
  // when launching keybindings -> map string command to number
  // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)

  // TODO matchingKeyBinding.command should always be number
  RendererWorker.send(/* KeyBindings.handleKeyBinding */ 'KeyBindings.handleKeyBinding', /* keyBinding */ matchingKeyBinding)
}

export const handleKeyDown = (event) => {
  const identifier = getIdentifier(event)
  const matchingKeyBinding = getMatchingKeyBinding(identifier)
  if (!matchingKeyBinding) {
    return
  }
  Event.preventDefault(event)
  handleMatchingKeyBinding(matchingKeyBinding)
}

export const handleKeyUp = (event) => {
  const modifier = getModifier(event)
  if (!modifier) {
    clearModifier()
    return
  }
  if (KeyBindingsState.isModifier(modifier)) {
    clearModifier()
    const identifier = `${modifier} ${modifier}`
    const matchingKeyBinding = getMatchingKeyBinding(identifier)
    if (matchingKeyBinding) {
      handleMatchingKeyBinding(matchingKeyBinding)
    }
    return
  }
  KeyBindingsState.setModifier(modifier)
  KeyBindingsState.setModifierTimeout(setTimeout(clearModifier, 300))
}
