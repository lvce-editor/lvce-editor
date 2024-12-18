import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const acceptEdit = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.acceptEdit', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
