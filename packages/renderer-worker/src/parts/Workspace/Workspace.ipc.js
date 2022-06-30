import * as Command from '../Command/Command.js'
import * as Workspace from './Workspace.js'

export const __initialize__ = () => {
  Command.register('Workspace.setPath', Workspace.setPath)
  Command.register('Workspace.hydrate', Workspace.hydrate)
  Command.register('Workspace.setUri', Workspace.setUri)
}
