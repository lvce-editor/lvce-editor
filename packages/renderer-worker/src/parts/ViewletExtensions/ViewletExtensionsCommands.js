import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as WrapExtensionSearchCommand from '../WrapExtensionSearchCommand/WrapExtensionSearchCommand.ts'
import * as ViewletExtensions from './ViewletExtensions.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapExtensionSearchCommand.wrapExtensionSearchCommand(command)
  }
  Commands['hotReload'] = ViewletExtensions.hotReload

  return Commands
}
