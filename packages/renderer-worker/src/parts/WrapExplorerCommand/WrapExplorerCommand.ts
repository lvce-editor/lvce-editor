import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const wrapExplorerCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ExplorerViewWorker.invoke(`Explorer.${key}`, state.uid, ...args)
    const commands = await ExplorerViewWorker.invoke('Explorer.render', state.uid)
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
