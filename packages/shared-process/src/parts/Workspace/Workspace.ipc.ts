import * as Workspace from './Workspace.ts'

export const name = 'Workspace'

export const Commands = {
  getHomeDir: Workspace.getHomeDir,
  resolveRoot: Workspace.resolveRoot,
}
