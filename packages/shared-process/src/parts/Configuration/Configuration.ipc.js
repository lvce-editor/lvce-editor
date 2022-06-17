import * as Command from '../Command/Command.js'
import * as Configuration from './Configuration.js'

export const __initialize = () => {
  Command.register(-1, Configuration.get)
  Command.register(-1, Configuration.set)
}
