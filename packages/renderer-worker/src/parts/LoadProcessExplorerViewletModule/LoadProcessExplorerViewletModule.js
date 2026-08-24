import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const loadProcessExplorerViewletModule = (platform = Platform.getPlatform()) => {
  if (platform === PlatformType.Web && !WorkspaceConnection.isActive()) {
    return import('../ViewletProcessExplorerUnsupported/ViewletProcessExplorerUnsupported.ipc.js')
  }
  return import('../ViewletProcessExplorer/ViewletProcessExplorer.ipc.js')
}
