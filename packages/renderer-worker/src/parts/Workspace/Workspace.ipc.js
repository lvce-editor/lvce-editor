import * as Workspace from './Workspace.js'
import { openRemote } from '../WorkspaceOpenRemote/WorkspaceOpenRemote.js'

export const name = 'Workspace'

export const Commands = {
  openRemote,
  close: Workspace.close,
  getPath: Workspace.getPath,
  getUri: Workspace.getUri,
  hydrate: Workspace.hydrate,
  setPath: Workspace.setPath,
  setUri: Workspace.setUri,
  supportsConnectionCommand: Workspace.supportsConnectionCommand,
}
