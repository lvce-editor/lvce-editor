import * as Context from '../Context/Context.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Platform from '../Platform/Platform.js'

const RE_ASCII = /[\p{ASCII}]+/u

export const state = {
  keyBindings: [],
  modifier: '',
  modifierTimeout: -1,
}

const isAscii = (key) => {
  return RE_ASCII.test(key)
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
  let key = event.key
  if (key === ' ') {
    key = 'Space'
  }
  if (key.length === 1) {
    key = key.toLowerCase()
  }
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
  const matchingKeyBindings = state.keyBindings.filter(matchesIdentifier)
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
  if (!state.modifier) {
    return
  }
  if (state.modifierTimeout !== -1) {
    clearTimeout(state.modifierTimeout)
    state.modifier = ''
    state.modifierTimeout = -1
  }
}

const handleMatchingKeyBinding = (matchingKeyBinding) => {
  // TODO execute command directly or -> executeCommand -> keybindings -> executeCommand
  // better directly
  // TODO always should be number
  // when launching keybindings -> map string command to number
  // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)

  // TODO matchingKeyBinding.command should always be number
  RendererWorker.send(
    /* KeyBindings.handleKeyBinding */ 'KeyBindings.handleKeyBinding',
    /* keyBinding */ matchingKeyBinding
  )
}

const handleKeyDown = (event) => {
  const identifier = getIdentifier(event)
  const matchingKeyBinding = getMatchingKeyBinding(identifier)
  if (!matchingKeyBinding) {
    return
  }
  event.preventDefault()
  handleMatchingKeyBinding(matchingKeyBinding)
}

const handleKeyUp = (event) => {
  const modifier = getModifier(event)
  if (!modifier) {
    clearModifier()
    return
  }
  if (state.modifier === modifier) {
    clearModifier()
    const identifier = `${modifier} ${modifier}`
    const matchingKeyBinding = getMatchingKeyBinding(identifier)
    if (matchingKeyBinding) {
      handleMatchingKeyBinding(matchingKeyBinding)
    }
    return
  }

  state.modifier = modifier
  // @ts-ignore
  state.modifierTimeout = setTimeout(clearModifier, 300)
}

export const hydrate = async (keyBindings) => {
  // TODO is this the right place for browser context ?
  // maybe in env file / env service
  const browser = Platform.getBrowser()
  Context.set(`browser.${browser}`, true)
  state.keyBindings = keyBindings
  window.addEventListener('keydown', handleKeyDown)
  // TODO only need keyup listener if keybindings include double modifier key (e.g "shift shift")
  window.addEventListener('keyup', handleKeyUp)
}

// TODO should be in renderer worker
export const lookupKeyBinding = (commandId) => {
  switch (commandId) {
    case 'scm.acceptInput':
      return 'Ctrl+Enter'
    default:
      return ''
  }
}
