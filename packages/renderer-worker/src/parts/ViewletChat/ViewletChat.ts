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

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await ChatViewWorker.invoke('Chat.saveState', state.uid)
  await ChatViewWorker.restart('Chat.terminate')
  await ChatViewWorker.invoke('Chat.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await ChatViewWorker.invoke('Chat.loadContent', state.uid, savedState)
  const diffResult = await ChatViewWorker.invoke('Chat.diff2', state.uid)
  const commands = await ChatViewWorker.invoke('Chat.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
