import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

// TODO add lots of tests for this
export const updateRoot = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.updateRoot', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
