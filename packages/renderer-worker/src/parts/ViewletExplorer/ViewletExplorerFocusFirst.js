import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusFirst = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.focusFirst', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
