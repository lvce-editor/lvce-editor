import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusLast = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.focusLast', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}
