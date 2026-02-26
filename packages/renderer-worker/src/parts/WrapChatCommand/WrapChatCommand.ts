import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'

export const wrapChatCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ChatViewWorker.invoke(`Chat.${key}`, state.id, ...args)
    const diffResult = await ChatViewWorker.invoke(`Chat.diff2`, state.id)
    const commands = await ChatViewWorker.invoke('Chat.render2', state.id, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
