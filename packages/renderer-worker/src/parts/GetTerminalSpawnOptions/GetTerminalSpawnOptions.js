import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

export const getTerminalSpawnOptions = async (cwd = '') => {
  const { workspaceUri } = WorkspaceState.state
  if (workspaceUri?.startsWith('devcontainers:///')) {
    return ExtensionHostCommands.executeCommand('devcontainer.getTerminalSpawnOptions', workspaceUri, cwd)
  }
  const remoteOptions = WorkspaceConnection.getTerminalSpawnOptions()
  if (remoteOptions) {
    return remoteOptions
  }
  return SharedProcess.invoke('GetTerminalSpawnOptions.getTerminalSpawnOptions')
}
