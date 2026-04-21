import * as ViewletDiffEditor2 from './ViewletDiffEditor2.js'
import * as WrapExplorerCommand from '../WrapExplorerCommand/WrapExplorerCommand.ts'
import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await DiffViewWorker.invoke('Diff.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapExplorerCommand.wrapExplorerCommand(command)
  }
  Commands['hotReload'] = ViewletDiffEditor2.hotReload
  return Commands
}
