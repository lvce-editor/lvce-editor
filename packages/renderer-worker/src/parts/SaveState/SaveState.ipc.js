import * as Command from '../Command/Command.js'
import * as SaveState from './SaveState.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('SaveState.hydrate', SaveState.hydrate)
  Command.register('SaveState.handleVisibilityChange', SaveState.handleVisibilityChange)
}
