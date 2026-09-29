import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const loadFileWatcherExplorerViewletModule = (platform = Platform.getPlatform()) => {
  if (platform === PlatformType.Web) {
    return import('../ViewletFileWatcherExplorerUnsupported/ViewletFileWatcherExplorerUnsupported.ipc.js')
  }
  return import('../ViewletFileWatcherExplorer/ViewletFileWatcherExplorer.ipc.js')
}
