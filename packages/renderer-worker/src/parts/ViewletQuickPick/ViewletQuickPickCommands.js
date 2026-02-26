import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'
import * as WrapQuickPickCommand from '../WrapQuickPickCommand/WrapQuickPickCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await QuickPickWorker.invoke('QuickPick.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapQuickPickCommand.wrapQuickPickCommand(command)
  }

  return Commands
}

export const saveState = (state) => {
  return {}
}
