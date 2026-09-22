import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'
import * as WrapRunAndDebugCommand from '../WrapRunAndDebugCommand/WrapRunAndDebugCommand.ts'
import * as DebugWorker from '../DebugWorker/DebugWorker.js'
import * as DebugTarget from '../DebugTarget/DebugTarget.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await DebugWorker.invoke('RunAndDebug.getCommandIds')
  for (const command of commands) {
    const getExtraArgs =
      command === 'loadContentLater'
        ? () => {
            const target = DebugTarget.consume()
            return target === undefined ? [] : [target]
          }
        : undefined
    Commands[command] = WrapRunAndDebugCommand.wrapRunAndDebugCommand(command, getExtraArgs)
  }
  Commands['hotReload'] = ViewletRunAndDebug.hotReload
  Commands['focus'] = ViewletRunAndDebug.focus
  return Commands
}
