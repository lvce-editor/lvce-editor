import * as Event from '../Event/Event.js'
import * as GetKeyBindingIdentifier from '../GetKeyBindingIdentifier/GetKeyBindingIdentifier.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleMatchingKeyBinding = (identifier) => {
  console.log({ identifier })
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
