import * as Command from '../Command/Command.js'
import * as Workbench from './Workbench.js'

export const __initialize__ = () => {
  Command.register(47110, Workbench.unload)
}
