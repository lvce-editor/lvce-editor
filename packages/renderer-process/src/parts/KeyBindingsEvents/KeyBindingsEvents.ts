import * as Event from '../Event/Event.ts'
import * as GetKeyBindingIdentifier from '../GetKeyBindingIdentifier/GetKeyBindingIdentifier.ts'
import * as IsMatchingKeyBinding from '../IsMatchingKeyBinding/IsMatchingKeyBinding.ts'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleMatchingKeyBinding = (identifier) => {
  RendererWorker.send(/* KeyBindings.handleKeyBinding */ 'KeyBindings.handleKeyBinding', /* keyBinding */ identifier)
}

export const handleKeyDown = (event) => {
  const identifier = GetKeyBindingIdentifier.getKeyBindingIdentifier(event)
  const identifiers = KeyBindingsState.getIdentifiers()
  const matchingKeyBinding = IsMatchingKeyBinding.isMatchingKeyBinding(identifiers, identifier)
  if (!matchingKeyBinding) {
    return
  }
  Event.preventDefault(event)
  handleMatchingKeyBinding(identifier)
}

export const handleKeyUp = (event) => {}
