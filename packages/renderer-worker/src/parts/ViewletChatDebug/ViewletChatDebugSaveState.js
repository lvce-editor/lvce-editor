import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'

export const saveState = (state) => {
  return ChatDebugViewWorker.invoke('ChatDebug.saveState', state.uid)
}
