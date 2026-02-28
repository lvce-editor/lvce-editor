import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'
import type { ChatState } from './ViewletChatTypes.ts'

export const create = (id, uri, x, y, width, height, args, parentUid): ChatState => {
  return {
    id,
    x,
    y,
    width,
    height,
    commands: [],
  }
}

export const loadContent = async (state: ChatState): Promise<ChatState> => {
  const { id, x, y, width, height } = state
  await ChatViewWorker.invoke('Chat.create', id, x, y, width, height)
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
  await ChatViewWorker.invoke('Chat.create', state.uid, state.x, state.y, state.width, state.height)
  await ChatViewWorker.invoke('Chat.loadContent', state.uid, savedState)
  const diffResult = await ChatViewWorker.invoke('Chat.diff2', state.uid)
  const commands = await ChatViewWorker.invoke('Chat.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}

export const saveState = (state) => {
  return ChatViewWorker.invoke('Chat.saveState', state.uid)
}
