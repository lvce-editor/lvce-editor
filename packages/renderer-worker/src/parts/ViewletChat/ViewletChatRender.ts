import type { ChatState } from './ViewletChatTypes.ts'
import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const renderDialog = {
  isEqual(oldState: ChatState, newState: ChatState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]

export const renderEventListeners = async () => {
  const listeners = await ChatViewWorker.invoke('Chat.renderEventListeners')
  return listeners
}
