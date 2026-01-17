import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as ViewletMain from '../ViewletMain/ViewletMain.js'
import { wrapMainAreaCommand } from '../WrapMainAreaCommand/WrapMainAreaCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await MainAreaWorker.invoke('MainArea`.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapMainAreaCommand(command)
  }
  Commands['hotReload'] = ViewletMain.hotReload

  return Commands
}
