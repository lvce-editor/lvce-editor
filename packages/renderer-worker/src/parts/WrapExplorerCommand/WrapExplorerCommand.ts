import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const wrapExplorerCommand = (key: string) => {
  const fn = async (state, ...args) => {
    const newState = await ExplorerViewWorker.invoke(`Explorer.${key}`, state, ...args)
    if (JSON.stringify(state) === JSON.stringify(newState)) {
      return state
    }
    const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
