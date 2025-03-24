import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as WrapExtensionSearchCommand from '../WrapExtensionSearchCommand/WrapExtensionSearchCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapExtensionSearchCommand.wrapExtensionSearchCommand(command)
  }
  return Commands
}
