import * as Workspace from './Workspace.js'

export const name = 'Workspace'

export const Commands = {
  getHomeDir: Workspace.getHomeDir,
  resolveRoot: Workspace.resolveRoot,
}
