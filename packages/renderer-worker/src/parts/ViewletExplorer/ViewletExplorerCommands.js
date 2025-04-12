import * as ViewletExplorer from './ViewletExplorer.js'
import * as WrapExplorerCommand from '../WrapExplorerCommand/WrapExplorerCommand.ts'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ExplorerViewWorker.invoke('Explorer.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapExplorerCommand.wrapExplorerCommand(command)
  }
  Commands['hotReload'] = ViewletExplorer.hotReload

  return Commands
}
