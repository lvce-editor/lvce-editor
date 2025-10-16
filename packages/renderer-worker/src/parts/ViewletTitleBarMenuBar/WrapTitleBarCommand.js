import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const wrapTitleBarCommand = (key) => {
  const fn = async (state, ...args) => {
    await TitleBarWorker.invoke(`TitleBar.${key}`, state.uid, ...args)
    const diffResult = await TitleBarWorker.invoke('TitleBar.diff3', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await TitleBarWorker.invoke('TitleBar.render3', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
