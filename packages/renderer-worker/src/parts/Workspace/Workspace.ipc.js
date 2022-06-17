import * as Command from '../Command/Command.js'
import * as Workspace from './Workspace.js'

export const __initialize__ = () => {
  Command.register(7633, Workspace.setPath)
  Command.register(7634, Workspace.hydrate)
  Command.register(7635, Workspace.setUri)
}
