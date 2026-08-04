import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'
import { wrapChatCommand } from '../WrapChatCommand/WrapChatCommand.ts'
import { focus, hotReload } from './ViewletChat.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ChatViewWorker.invoke('Chat.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapChatCommand(command)
  }
  Commands['hotReload'] = hotReload
  Commands['focus'] = focus
  return Commands
}
