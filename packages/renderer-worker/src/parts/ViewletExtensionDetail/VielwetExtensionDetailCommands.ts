import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as ViewletExtensionDetail from './ViewletExtensionDetail.ts'
import * as WrapExtensionDetailCommand from './WrapExtensionDetailCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapExtensionDetailCommand.wrapExtensionDetailCommand(command)
  }
  Commands['hotReload'] = ViewletExtensionDetail.hotReload
  return Commands
}
