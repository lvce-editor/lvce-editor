import * as Command from '../Command/Command.js'
import * as SaveState from './SaveState.js'

export const __initialize__ = () => {
  Command.register('SaveState.hydrate', SaveState.hydrate)
}
