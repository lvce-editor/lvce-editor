import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'

export const wrapStatusBarCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await StatusBarWorker.invoke(`StatusBar.${key}`, state.uid, ...args)
    const diffResult = await StatusBarWorker.invoke('StatusBar.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await StatusBarWorker.invoke('StatusBar.render2', state.uid, diffResult)
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
