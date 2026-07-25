import * as DialogWorker from '../DialogWorker/DialogWorker.js'

export const wrapDialogCommand = (key) => {
  const fn = async (state, ...args) => {
    await DialogWorker.invoke(`Dialog.${key}`, state.id, ...args)
    const diffResult = await DialogWorker.invoke('Dialog.diff2', state.id)
    const commands = await DialogWorker.invoke('Dialog.render2', state.id, diffResult)
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
