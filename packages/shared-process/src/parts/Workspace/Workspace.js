import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as ResolveRoot from '../ResolveRoot/ResolveRoot.js'

/**
 * @deprecated use platform instead
 */
export const getHomeDir = () => {
  if (Platform.isWindows) {
    return ''
  }
  const homeDir = homedir()
  return homeDir
}

export const resolveRoot = ResolveRoot.resolveRoot

export const resolveUri = (uri) => {
  const path = fileURLToPath(uri)
  return {
    path,
    uri,
    homeDir: PlatformPaths.getHomeDir(),
    pathSeparator: Platform.getPathSeparator(),
  }
}

export const setData = (id, data) => {
  console.log({ id, data })
}
