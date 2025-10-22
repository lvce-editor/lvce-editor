import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import { wrapTitleBarCommand } from '../ViewletTitleBarMenuBar/WrapTitleBarCommand.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await TitleBarWorker.invoke('TitleBar.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapTitleBarCommand(command)
  }
  return Commands
}
