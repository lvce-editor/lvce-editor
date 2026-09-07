import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const getTerminalSpawnOptions = async () => {
  const remoteOptions = WorkspaceConnection.getTerminalSpawnOptions()
  if (remoteOptions) {
    return remoteOptions
  }
  return SharedProcess.invoke('GetTerminalSpawnOptions.getTerminalSpawnOptions')
}
