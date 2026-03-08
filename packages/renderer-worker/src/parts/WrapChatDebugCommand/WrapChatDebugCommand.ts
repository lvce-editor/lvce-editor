import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'

export const wrapChatDebugCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ChatViewWorker.invoke(`ChatDebug.${key}`, state.id, ...args)
    const diffResult = await ChatViewWorker.invoke(`ChatDebug.diff2`, state.id)
    const commands = await ChatViewWorker.invoke('ChatDebug.render2', state.id, diffResult)
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
