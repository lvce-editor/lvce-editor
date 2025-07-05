import * as ViewletLocations from './ViewletLocations.js'
import * as ReferencesWorker from '../ReferencesWorker/ReferencesWorker.js'
import { wrapReferencesCommand } from '../WrapReferencesCommand/WrapReferencesCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ReferencesWorker.invoke('References.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapReferencesCommand(command)
  }
  Commands['hotReload'] = ViewletLocations.hotReload
  return Commands
}
