import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'

export const wrapMainAreaCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await MainAreaWorker.invoke(`MainArea.${key}`, state.uid, ...args)
    const diffResult = await MainAreaWorker.invoke('MainArea.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await MainAreaWorker.invoke('MainArea.render2', state.uid, diffResult)
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
