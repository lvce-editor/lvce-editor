import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'
import * as WrapProcessExplorerCommand from '../WrapProcessExplorerCommand/WrapProcessExplorerCommand.ts'
import * as ViewletProcessExplorer from './ViewletProcessExplorer.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ProcessExplorerWorker.invoke('ProcessExplorer.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapProcessExplorerCommand.wrapProcessExplorerCommand(command)
  }
  Commands['hotReload'] = ViewletProcessExplorer.hotReload
  return Commands
}
