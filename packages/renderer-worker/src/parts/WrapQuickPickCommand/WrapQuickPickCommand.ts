import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const wrapQuickPickCommand = (key) => {
  const fn = async (state, ...args) => {
    await FileSearchWorker.invoke(`QuickPick.${key}`, state.uid, ...args)
    const diffResult = await FileSearchWorker.invoke('QuickPick.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await FileSearchWorker.invoke('QuickPick.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
