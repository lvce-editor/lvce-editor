import * as Assert from '../Assert/Assert.js'
import * as Context from '../Context/Context.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as Platform from '../Platform/Platform.js'

// TODO store keybindings as json somewhere

// TODO sort keybindings by `when` priority -> focus.editorCompletions: 10, focus.editor:9 etc.

// TODO does it make sense to have all of these configurable?
// could remove some context logic and have less user configuration when these are default
// e.g. arrow down focuses next, arrow up always focuses previous item (like in aria spec)

// TODO ui should only have keys -> commands get resolved inside renderer worker
// TODO should toggle terminal, not only open

export const addKeyBindings = (id, keyBindings) => {
  Assert.string(id)
  Assert.array(keyBindings)
  KeyBindingsState.addKeyBindings(id, keyBindings)
}

export const removeKeyBindings = (id) => {
  KeyBindingsState.removeKeyBindings(id)
}

export const hydrate = (keyBindings) => {
  // TODO is this the right place for browser context ?
  // maybe in env file / env service
  const browser = Platform.getBrowser()
  Context.set(`browser.${browser}`, true)
  addKeyBindings('initial', keyBindings)
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
