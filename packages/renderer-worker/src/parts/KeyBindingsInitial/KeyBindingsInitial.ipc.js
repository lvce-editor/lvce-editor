import * as Command from '../Command/Command.js'
import * as KeyBindingsInitial from './KeyBindingsInitial.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('KeyBindingsInitial.getKeyBindings', KeyBindingsInitial.getKeyBindings)
}
