import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusIndex = async (state, index) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.focusIndex', state, index)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
