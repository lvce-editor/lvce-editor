import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'

export const getKeyBindings = () => {
  return ChatViewWorker.invoke('Chat.getKeyBindings')
}
