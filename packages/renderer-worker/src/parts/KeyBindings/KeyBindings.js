import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'
import * as Context from '../Context/Context.js'
import * as Platform from '../Platform/Platform.js'
import * as Focus from '../Focus/Focus.js'

// TODO store keybindings as json somewhere

// TODO sort keybindings by `when` priority -> focus.editorCompletions: 10, focus.editor:9 etc.

// TODO does it make sense to have all of these configurable?
// could remove some context logic and have less user configuration when these are default
// e.g. arrow down focuses next, arrow up always focuses previous item (like in aria spec)

// TODO ui should only have keys -> commands get resolved inside renderer worker
// TODO should toggle terminal, not only open

export const state = {
  keyBindings: [],
  modifier: '',
  modifierTimeout: -1,
}

const getIdentifier = (isCtrlKey, isShiftKey, isAltKey, key) => {
  let identifier = ''
  if (isCtrlKey) {
    identifier += 'ctrl+'
  }
  if (isShiftKey) {
    identifier += 'shift+'
  }
  if (isAltKey) {
    identifier += 'alt+'
  }
  if (key === ' ') {
    key = 'Space'
  }
  if (key.length === 1) {
    key = key.toLowerCase()
  }
  identifier += key
  return identifier
}

const matchesContext = (keybinding) => {
  if (!keybinding.when) {
    return true
  }
  return Context.get(keybinding.when)
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

const getMatchingKeyBinding = (identifier) => {
  // TODO this could be more efficient in O(N) instead of O(2N)
  // TODO this could be more efficient with hashmap or UInt32Array in O(1)
  const matchesIdentifier = (keyBinding) => {
    return keyBinding.key === identifier
  }
  const matchingKeyBindings = state.keyBindings.filter(matchesIdentifier)
  const matchingKeyBinding = matchingKeyBindings.find(matchesContext)
  return matchingKeyBinding
}

const getKeyBindings = async () => {
  return Command.execute(
    /* KeyBindingsInitial.getKeyBindings */ 'KeyBindingsInitial.getKeyBindings'
  )
}

export const hydrate = async () => {
  try {
    const keyBindings = await getKeyBindings()
    state.keyBindings = keyBindings
    // TODO is this the right place for browser context ?
    // maybe in env file / env service
    const browser = Platform.getBrowser()
    Context.set(`browser.${browser}`, true)
    await RendererProcess.invoke(
      /* KeyBindings.hydrate */ 'KeyBindings.hydrate',
      /* keyBindings */ keyBindings
    )
  } catch (error) {
    ErrorHandling.handleError(new VError(error, 'Failed to load KeyBindings'))
  }
}

// TODO where to store keybindings? need them here and in renderer process
// how to avoid duplicate loading / where to store them and keep them in sync?
export const lookupKeyBinding = (commandId) => {
  switch (commandId) {
    case 'scm.acceptInput':
      return 'Ctrl+Enter'
    default:
      return ''
  }
}

export const handleKeyDown = async (isCtrlKey, isShiftKey, isAltKey, key) => {
  console.log({ key })
  const identifier = getIdentifier(isCtrlKey, isShiftKey, isAltKey, key)
  const matchingKeyBinding = getMatchingKeyBinding(identifier)
  if (!matchingKeyBinding) {
    const focus = Focus.get()
    if (focus) {
      await Command.execute(`${focus}.handleKeyDown`, key)
    }
    // console.log({ focus })
    // TODO if there are no meta keys and there is a focused input element,
    // dispatch keycode to that input element
    return
  }
  await handleMatchingKeyBinding(matchingKeyBinding)
}

const handleMatchingKeyBinding = async (matchingKeyBinding) => {
  // TODO execute command directly or -> executeCommand -> keybindings -> executeCommand
  // better directly
  // TODO always should be number
  // when launching keybindings -> map string command to number
  // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)
  // TODO matchingKeyBinding.command should always be number
  // TODO execute that command

  await Command.execute(
    /* command */ matchingKeyBinding.command,
    // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)
    ...(matchingKeyBinding.args || [])
  )
  // TODO
  // else if (typeof keyBinding.command === 'string') {
  //   // TODO should calling command be async ? (actually don't care if it resolves -> can just send error event in case of error)
  //   await SharedProcess.invoke(
  //     /* ExtensionHost.executeCommand */ 'ExtensionHost.executeCommand',
  //     /* commandId */ keyBinding.command,
  //     ...(keyBinding.args || [])
  //   )
  // }
}

export const handleKeyUp = (event) => {
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
