import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const loadFileWatcherExplorerViewletModule = (platform = Platform.getPlatform()) => {
  if (platform === PlatformType.Web && !WorkspaceConnection.isActive()) {
    return import('../ViewletFileWatcherExplorerUnsupported/ViewletFileWatcherExplorerUnsupported.ipc.js')
  }
  return import('../ViewletFileWatcherExplorer/ViewletFileWatcherExplorer.ipc.js')
}
