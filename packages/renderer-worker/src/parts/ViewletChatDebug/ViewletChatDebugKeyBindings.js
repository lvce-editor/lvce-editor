import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'

export const getKeyBindings = () => {
  return ChatDebugViewWorker.invoke('ChatDebug.getKeyBindings')
}
