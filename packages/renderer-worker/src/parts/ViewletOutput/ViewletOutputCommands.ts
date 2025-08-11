import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as WrapOutputCommand from '../WrapOutputCommand/WrapOutputCommand.ts'
import * as ViewletOutput from '../ViewletOutput/ViewletOutput.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await OutputViewWorker.invoke('Output.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapOutputCommand.wrapOutputCommand(command)
  }
  Commands['hotReload'] = ViewletOutput.hotReload

  return Commands
}
