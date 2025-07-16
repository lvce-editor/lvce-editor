import * as DebugWorker from '../DebugWorker/DebugWorker.js'
import * as WrapProblemsCommand from '../WrapProblemsCommand/WrapProblemsCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await DebugWorker.invoke('Problems.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapProblemsCommand.wrapProblemsCommand(command)
  }
  // TODO
  // Commands['hotReload'] = ViewletRunAndDebug.hotReload
  return Commands
}
