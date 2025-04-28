import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'
import * as WrapRunAndDebugCommand from '../WrapRunAndDebugCommand/WrapRunAndDebugCommand.ts'
import * as DebugWorker from '../DebugWorker/DebugWorker.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await DebugWorker.invoke('RunAndDebug.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapRunAndDebugCommand.wrapRunAndDebugCommand(command)
  }
  Commands['hotReload'] = ViewletRunAndDebug.hotReload
  return Commands
}
