import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const wrapQuickPickCommand = (key) => {
  const fn = async (state, ...args) => {
    await FileSearchWorker.invoke(`QuickPick.${key}`, state.uid, ...args)
    const commands = await FileSearchWorker.invoke('QuickPick.render', state.uid)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
