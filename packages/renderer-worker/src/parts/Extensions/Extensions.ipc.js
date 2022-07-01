import * as Command from '../Command/Command.js'
import * as Extensions from './Extensions.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Extensions.openExtensionsFolder', Extensions.openExtensionsFolder)
  Command.register('Extensions.openCachedExtensionsFolder', Extensions.openCachedExtensionsFolder)
}
