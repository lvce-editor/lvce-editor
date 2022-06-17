import * as Command from '../Command/Command.js'
import * as Extensions from './Extensions.js'

export const __initialize__ = () => {
  Command.register(7650, Extensions.openExtensionsFolder)
  Command.register(7651, Extensions.openCachedExtensionsFolder)
}
