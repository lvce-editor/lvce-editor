import * as Workspace from './Workspace.js'

export const name = 'Workspace'

export const Commands = {
  close: Workspace.close,
  getPath: Workspace.getPath,
  getUri: Workspace.getUri,
  hydrate: Workspace.hydrate,
  setPath: Workspace.setPath,
  setUri: Workspace.setUri,
}
