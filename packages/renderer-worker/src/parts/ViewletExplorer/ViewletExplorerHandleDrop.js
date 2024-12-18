import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handleDrop = async (state, x, y, files) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleDrop', state, x, y, files)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
