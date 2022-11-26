import * as Workspace from './Workspace.js'

export const name = 'Workspace'

export const Commands = {
  hydrate: Workspace.hydrate,
  setPath: Workspace.setPath,
  setUri: Workspace.setUri,
}
