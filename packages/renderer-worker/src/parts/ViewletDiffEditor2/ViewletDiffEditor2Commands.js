import * as ViewletDiffEditor2 from './ViewletDiffEditor2.js'
import * as WrapDiffViewCommand from '../WrapDiffViewCommand/WrapDiffViewCommand.ts'
import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await DiffViewWorker.invoke('Diff.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapDiffViewCommand.wrapDiffViewCommand(command)
  }
  Commands['hotReload'] = ViewletDiffEditor2.hotReload
  return Commands
}
