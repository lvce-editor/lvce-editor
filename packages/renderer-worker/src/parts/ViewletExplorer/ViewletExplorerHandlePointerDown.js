import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handlePointerDown = async (state, button, x, y) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handlePointerDown', state, x, y)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
