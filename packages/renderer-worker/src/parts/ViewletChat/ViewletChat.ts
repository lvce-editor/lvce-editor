import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'
import type { ChatState } from './ViewletChatTypes.ts'

export const create = (id: number): ChatState => {
  return {
    id,
    commands: [],
  }
}

export const loadContent = async (state: ChatState): Promise<ChatState> => {
  const { id } = state
  await ChatViewWorker.invoke('Chat.create', id)
  await ChatViewWorker.invoke('Chat.loadContent2', id)
  const diffResult = await ChatViewWorker.invoke('Chat.diff2', id)
  const commands = await ChatViewWorker.invoke('Chat.render2', id, diffResult)
  return {
    ...state,
    commands,
  }
}
