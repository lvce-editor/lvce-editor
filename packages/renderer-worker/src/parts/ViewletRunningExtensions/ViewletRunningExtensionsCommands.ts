import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts'
import { wrapRunningExtensionsCommand } from '../WrapRunningExtensionsCommand/WrapRunningExtensionsCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await RunningExtensionsViewWorker.invoke('RunningExtensions.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapRunningExtensionsCommand(command)
  }
  return Commands
}
