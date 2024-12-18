import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handleDragOver = async (state, x, y) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleDragOver', state, x, y)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
