import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as Env from '../Env/Env.js'
import * as GetWorkspaceId from '../GetWorkspaceId/GetWorkspaceId.js'
import * as IsAbsolutePath from '../IsAbsolutePath/IsAbsolutePath.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as Root from '../Root/Root.js'
import * as WorkspaceSource from '../WorkspaceSource/WorkspaceSource.js'

const getAbsolutePath = (path) => {
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

const toUri = (path) => {
  return pathToFileURL(path).toString()
}

export const resolveRoot = async () => {
  if (IsElectron.isElectron) {
    const argv = await ParentIpc.invoke('Process.getArgv')
    const relevantArgv = argv.slice(2)
    const last = relevantArgv.at(-1)
    if (last && isAbsolute(last)) {
      return {
        path: last,
        uri: toUri(last),
        workspaceId: GetWorkspaceId.getWorkspaceId(last),
        homeDir: PlatformPaths.getHomeDir(),
        homeDirUri: toUri(PlatformPaths.getHomeDir()),
        pathSeparator: Platform.getPathSeparator(),
        source: 'shared-process-default',
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
