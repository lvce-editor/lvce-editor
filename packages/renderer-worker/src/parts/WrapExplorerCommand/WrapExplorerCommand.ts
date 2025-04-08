import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const wrapExplorerCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ExplorerViewWorker.invoke(`Explorer.${key}`, state.uid, ...args)
    const diffResult = await ExplorerViewWorker.invoke('Explorer.diff2', state.uid)
    const commands = await ExplorerViewWorker.invoke('Explorer.render2', state.uid, diffResult)
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
