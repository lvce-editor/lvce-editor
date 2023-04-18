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
  if (!id) {
    throw new Error('id must be defined')
  }
  Assert.array(keyBindings)
  KeyBindingsState.addKeyBindings(id, keyBindings)
}

export const removeKeyBindings = (id) => {
  KeyBindingsState.removeKeyBindings(id)
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
