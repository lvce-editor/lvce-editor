import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handlePaste = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handlePaste', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
