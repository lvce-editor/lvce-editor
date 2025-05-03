import * as ViewletSourceControl from './ViewletSourceControl.js'
import * as WrapSourceControlCommand from '../WrapSourceControlCommand/WrapSourceControlCommand.ts'
import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await SourceControlWorker.invoke('SourceControl.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapSourceControlCommand.wrapSourceControlCommand(command)
  }
  Commands['hotReload'] = ViewletSourceControl.hotReload
  return Commands
}
