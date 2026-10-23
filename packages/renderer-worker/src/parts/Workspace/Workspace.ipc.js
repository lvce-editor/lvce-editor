import * as Workspace from './Workspace.js'
import { openRemote } from '../WorkspaceOpenRemote/WorkspaceOpenRemote.js'

export const name = 'Workspace'

export const Commands = {
  openRemote,
  close: Workspace.close,
  getHomeDir: Workspace.getHomeDir,
  getPath: Workspace.getPath,
  getUri: Workspace.getUri,
  hydrate: Workspace.hydrate,
  startProgress: Workspace.startProgress,
  cancelProgress: Workspace.cancelProgress,
  isProgressCancelled: Workspace.isProgressCancelled,
  updateProgress: Workspace.updateProgress,
  endProgress: Workspace.endProgress,
  handleExtensionProgressChange: Workspace.handleExtensionProgressChange,
  setPath: Workspace.setPath,
  setUri: Workspace.setUri,
  supportsConnectionCommand: Workspace.supportsConnectionCommand,
}
