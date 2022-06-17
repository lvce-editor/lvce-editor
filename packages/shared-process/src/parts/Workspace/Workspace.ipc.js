import * as Command from '../Command/Command.js'
import * as Workspace from './Workspace.js'

export const __initialize__ = () => {
  Command.register('Workspace.resolveRoot', Workspace.resolveRoot)
  Command.register('Workspace.getHomeDir', Workspace.getHomeDir)
}
