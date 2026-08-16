import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WorkspaceBackend from '../WorkspaceBackend/WorkspaceBackend.js'

export const loadProcessExplorerViewletModule = (platform = Platform.getPlatform()) => {
  if (platform === PlatformType.Web && !WorkspaceBackend.isActive()) {
    return import('../ViewletProcessExplorerUnsupported/ViewletProcessExplorerUnsupported.ipc.js')
  }
  return import('../ViewletProcessExplorer/ViewletProcessExplorer.ipc.js')
}
