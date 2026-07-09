import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as Env from '../Env/Env.ts'
import * as GetWorkspaceId from '../GetWorkspaceId/GetWorkspaceId.ts'
import * as IsAbsolutePath from '../IsAbsolutePath/IsAbsolutePath.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Root from '../Root/Root.ts'
import * as WorkspaceSource from '../WorkspaceSource/WorkspaceSource.ts'

const getAbsolutePath = (path: any): any => {
  if (IsAbsolutePath.isAbsolutePath(path)) {
    return path
  }
  if (path.startsWith('${cwd}')) {
    path = Root.root + path.slice(5)
  } else if (path.startsWith('~')) {
    path = `${homedir()}${path.slice(1)}`
  }
  path = resolve(path)
  return path
}

const toUri = (path: any): any => {
  return pathToFileURL(path).toString()
}

export const resolveRoot = async (): Promise<any> => {
  if (IsElectron.isElectron) {
    const argv = await ParentIpc.invoke('Process.getArgv')
    const relevantArgv = argv.slice(2)
    const last = relevantArgv.at(-1)
    if (last && last === '.') {
      const actual = process.cwd()
      return {
        path: actual,
        uri: toUri(actual),
        workspaceId: GetWorkspaceId.getWorkspaceId(actual),
        homeDir: PlatformPaths.getHomeDir(),
        homeDirUri: toUri(PlatformPaths.getHomeDir()),
        pathSeparator: Platform.getPathSeparator(),
        source: WorkspaceSource.SharedProcessCliArg,
      }
    }
    if (last && isAbsolute(last)) {
      return {
        path: last,
        uri: toUri(last),
        workspaceId: GetWorkspaceId.getWorkspaceId(last),
        homeDir: PlatformPaths.getHomeDir(),
        homeDirUri: toUri(PlatformPaths.getHomeDir()),
        pathSeparator: Platform.getPathSeparator(),
        source: WorkspaceSource.SharedProcessCliArg,
      }
    }
  }

  // TODO shared process should have no logic, this should probably be somewhere else
  const folder = Env.getFolder()
  if (!folder) {
    const path = join(Root.root, 'playground')
    return {
      path,
      uri: toUri(path),
      workspaceId: GetWorkspaceId.getWorkspaceId(path),
      homeDir: PlatformPaths.getHomeDir(),
      homeDirUri: toUri(PlatformPaths.getHomeDir()),
      pathSeparator: Platform.getPathSeparator(),
      source: WorkspaceSource.SharedProcessEnv,
    }
  }
  const absolutePath = getAbsolutePath(folder)
  const workspaceId = GetWorkspaceId.getWorkspaceId(absolutePath)
  // TODO this slows down startup a lot (~30-50ms)
  // const workspaceStorage = await getWorkspaceStorage(workspaceId)
  return {
    path: absolutePath,
    uri: toUri(absolutePath),
    workspaceId,
    homeDir: PlatformPaths.getHomeDir(),
    homeDirUri: toUri(PlatformPaths.getHomeDir()),
    pathSeparator: Platform.getPathSeparator(),
    source: WorkspaceSource.SharedProcessDefault,
  }
}
