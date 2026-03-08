import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'

export const wrapChatDebugCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ChatDebugViewWorker.invoke(`ChatDebug.${key}`, state.id, ...args)
    const diffResult = await ChatDebugViewWorker.invoke(`ChatDebug.diff2`, state.id)
    const commands = await ChatDebugViewWorker.invoke('ChatDebug.render2', state.id, diffResult)
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
