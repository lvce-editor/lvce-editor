import * as Command from '../Command/Command.js'
import * as KeyBindingsInitial from './KeyBindingsInitial.js'

export const __initialize__ = () => {
  Command.register(8961, KeyBindingsInitial.getKeyBindings)
}
