import { getGitRemote } from '../GetGitRemote/GetGitRemote.ts'
import * as Workspace from './Workspace.ts'

export const name = 'Workspace'

export const Commands = {
  getGitRemote,
  getHomeDir: Workspace.getHomeDir,
  resolveRoot: Workspace.resolveRoot,
}
