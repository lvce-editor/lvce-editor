import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'
import * as WrapAboutCommand from '../WrapAboutCommand/WrapAboutCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await KeyBindingsViewWorker.invoke('About.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapAboutCommand.wrapAboutCommand(command)
  }
  return Commands
}
