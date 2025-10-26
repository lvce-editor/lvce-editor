import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'

export const wrapActivityBarCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ActivityBarWorker.invoke(`ActivityBar.${key}`, state.uid, ...args)
    const diffResult = await ActivityBarWorker.invoke('ActivityBar.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await ActivityBarWorker.invoke('ActivityBar.render2', state.uid, diffResult)
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
