import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const wrapTitleBarMenuBarCommand = (key) => {
  const fn = async (state, ...args) => {
    await TextSearchWorker.invoke(`TitleBarMenuBar.${key}`, state.uid, ...args)
    const commands = await TextSearchWorker.invoke('TitleBarMenuBar.render', state.uid)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
