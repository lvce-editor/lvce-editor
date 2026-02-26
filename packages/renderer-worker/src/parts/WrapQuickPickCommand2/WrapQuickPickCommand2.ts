import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'

export const wrapQuickPickCommand2 = (key) => {
  const fn = async (state, ...args) => {
    await QuickPickWorker.invoke(`QuickPick.${key}`, state.uid, ...args)
    const diffResult = await QuickPickWorker.invoke('QuickPick.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await QuickPickWorker.invoke('QuickPick.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
