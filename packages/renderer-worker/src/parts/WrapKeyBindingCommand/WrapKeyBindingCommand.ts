import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const wrapKeyBindingCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ExplorerViewWorker.invoke(`KeyBindings.${key}`, state.uid, ...args)
    const commands = await ExplorerViewWorker.invoke('KeyBindings.render2', state.uid)
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
