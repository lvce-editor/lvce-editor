import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const wrapTitleBarMenuBarCommand = (key) => {
  const fn = async (state, ...args) => {
    await TitleBarWorker.invoke(`TitleBarMenuBar.${key}`, state.uid, ...args)
    const diffResult = await TitleBarWorker.invoke('TitleBarMenuBar.diff2', state.uid)
    const commands = await TitleBarWorker.invoke('TitleBarMenuBar.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
