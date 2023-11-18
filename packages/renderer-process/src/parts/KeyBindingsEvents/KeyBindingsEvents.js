import * as Event from '../Event/Event.js'
import * as GetKeyBindingIdentifier from '../GetKeyBindingIdentifier/GetKeyBindingIdentifier.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

// TODO store keybindings as json somewhere

// TODO sort keybindings by `when` priority -> focus.editorCompletions: 10, focus.editor:9 etc.

// TODO does it make sense to have all of these configurable?
// could remove some context logic and have less user configuration when these are default
// e.g. arrow down focuses next, arrow up always focuses previous item (like in aria spec)

// TODO ui should only have keys -> commands get resolved inside renderer worker
// TODO should toggle terminal, not only open

const handleMatchingKeyBinding = (identifier) => {
  // TODO execute command directly or -> executeCommand -> keybindings -> executeCommand
  // better directly
  // TODO always should be number
  // when launching keybindings -> map string command to number
  // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)

  // TODO matchingKeyBinding.command should always be number
  RendererWorker.send(/* KeyBindings.handleKeyBinding */ 'KeyBindings.handleKeyBinding', /* keyBinding */ identifier)
}

export const handleKeyDown = (event) => {
  const identifier = GetKeyBindingIdentifier.getKeyBindingIdentifier(event)
  const identifiers = KeyBindingsState.getIdentifiers()
  const matchingKeyBinding = identifiers.includes(identifier)
  if (!matchingKeyBinding) {
    return
  }
  Event.preventDefault(event)
  handleMatchingKeyBinding(identifier)
}

export const handleKeyUp = (event) => {}
