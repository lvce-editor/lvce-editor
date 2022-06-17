import * as Command from '../Command/Command.js'
import * as KeyBindings from './KeyBindings.js'

export const __initialize__ = () => {
  Command.register(1422, KeyBindings.handleKeyBinding)
  Command.register(1423, KeyBindings.hydrate)
}
