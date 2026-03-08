import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'
import * as WrapChatDebugCommand from '../WrapChatDebugCommand/WrapChatDebugCommand.ts'
import * as ViewletChatDebug from '../ViewletChatDebug/ViewletChatDebug.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ChatDebugViewWorker.invoke('ChatDebug.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapChatDebugCommand.wrapChatDebugCommand(command)
  }
  Commands['hotReload'] = ViewletChatDebug.hotReload

  return Commands
}
