import * as DialogWorker from '../DialogWorker/DialogWorker.js'
import * as WrapDialogCommand from '../WrapDialogCommand/WrapDialogCommand.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await DialogWorker.invoke('Dialog.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapDialogCommand.wrapDialogCommand(command)
  }
  return Commands
}
