import * as ViewletLocations from './ViewletLocations.js'
import * as ReferencesWorker from '../ReferencesWorker/ReferencesWorker.js'
import { wrapReferencesCommand } from '../WrapRunAndDebugCommand/WrapRunAndDebugCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ReferencesWorker.invoke('Locations.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapReferencesCommand(command)
  }
  Commands['hotReload'] = ViewletLocations.hotReload
  return Commands
}
