import * as Command from '../Command/Command.js'
import * as KeyBindings from './KeyBindings.js'

export const __initialize__ = () => {
  Command.register('KeyBindings.handleKeyBinding', KeyBindings.handleKeyDown)
  Command.register('KeyBindings.hydrate', KeyBindings.hydrate)
}
