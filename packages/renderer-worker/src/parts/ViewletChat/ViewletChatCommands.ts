import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'
import * as WrapAboutCommand from '../WrapAboutCommand/WrapAboutCommand.ts'
import { hotReload } from './ViewletChat.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ChatViewWorker.invoke('Chat.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapAboutCommand.wrapAboutCommand(command)
  }
  Commands['hotReload'] = hotReload
  return Commands
}
