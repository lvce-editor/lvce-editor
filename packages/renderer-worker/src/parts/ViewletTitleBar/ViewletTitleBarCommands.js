import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import { wrapTitleBarCommand } from './WrapTitleBarCommand.js'
import * as TitleBar from './ViewletTitleBar.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await TitleBarWorker.invoke('TitleBar.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapTitleBarCommand(command)
  }
  Commands['hotReload'] = TitleBar.hotReload
  return Commands
}
