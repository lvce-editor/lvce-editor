import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const wrapTitleBarMenuBarCommand = (key) => {
  const fn = async (state, ...args) => {
    await TitleBarWorker.invoke(`TitleBarMenuBar.${key}`, state.uid, ...args)
    const commands = await TitleBarWorker.invoke('TitleBarMenuBar.render', state.uid)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
