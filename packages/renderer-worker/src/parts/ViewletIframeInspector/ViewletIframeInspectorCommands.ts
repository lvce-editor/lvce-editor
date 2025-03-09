import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as WrapAboutCommand from '../WrapAboutCommand/WrapAboutCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  // TODO
  const commands = await AboutViewWorker.invoke('About.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapAboutCommand.wrapAboutCommand(command)
  }
  return Commands
}
