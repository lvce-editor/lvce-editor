import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTerminalWorker from '../LaunchTerminalWorker/LaunchTerminalWorker.js'

const { invoke, invokeAndTransfer, isCreated } = GetOrCreateWorker.getOrCreateWorker(LaunchTerminalWorker.launchTerminalWorker)

export const resetWorkspaceConnection = async () => {
  if (isCreated()) {
    await invoke('Terminal.resetWorkspaceConnection')
  }
}

export { invoke, invokeAndTransfer }
