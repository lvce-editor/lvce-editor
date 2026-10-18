import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

export const getTerminalSpawnOptions = async (cwd = '') => {
  const { workspaceUri } = WorkspaceState.state
  if (workspaceUri?.startsWith('devcontainers:///')) {
    return ExtensionHostCommands.executeCommand('devcontainer.getTerminalSpawnOptions', workspaceUri, cwd)
  }
  const transportUri = await ExtensionManagementWorker.invoke('Extensions.getWorkspaceTransportUri')
  if (transportUri) {
    return ExtensionManagementWorker.invoke('Extensions.executeWorkspaceRequest', transportUri, 'terminal-options')
  }
  const remoteOptions = WorkspaceConnection.getTerminalSpawnOptions()
  if (remoteOptions) {
    return remoteOptions
  }
  if (Platform.getPlatform() === PlatformType.Web) {
    return {
      args: [],
      command: '',
      spawnError: 'Terminals are unavailable in this web workspace. Connect to a remote workspace to run a shell.',
    }
  }
  return SharedProcess.invoke('GetTerminalSpawnOptions.getTerminalSpawnOptions')
}
