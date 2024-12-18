import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const expandRecursively = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.expandRecursively', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
