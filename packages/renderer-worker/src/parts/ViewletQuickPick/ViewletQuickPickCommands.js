import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'
import * as WrapQuickPickCommand from '../WrapQuickPickCommand/WrapQuickPickCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await FileSearchWorker.invoke('QuickPick.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapQuickPickCommand.wrapQuickPickCommand(command)
  }

  return Commands
}

export const saveState = (state) => {
  return {}
}
