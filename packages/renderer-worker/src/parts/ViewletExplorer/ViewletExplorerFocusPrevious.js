import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusPrevious = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.focusPrevious', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
