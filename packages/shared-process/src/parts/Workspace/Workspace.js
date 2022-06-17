import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as Env from '../Env/Env.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'

const RE_ABSOLUTE_URI = /^[a-z]+:\/\//

const isAbsoluteUri = (path) => {
  return RE_ABSOLUTE_URI.test(path)
}

const getAbsolutePath = (path) => {
  if (isAbsoluteUri(path)) {
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

const getWorkspaceStorage = async (workspaceId) => {
  try {
    const workspaceStorage = JSON.parse(
      await readFile(`/tmp/config/${workspaceId}`, 'utf-8')
    )
    return workspaceStorage
  } catch {
    return {}
  }
}

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

const getWorkspaceId = (absolutePath) => {
  return createHash('sha256').update(absolutePath).digest('hex').slice(0, 16)
}

const configs = {
  messagePort1: {
    folder: '/tmp',
  },
  messagePort2: {
    folder: '~',
  },
}

const toUri = (path) => {
  return pathToFileURL(path).toString()
}

export const resolveRoot = async () => {
  // TODO ask electron, electron can do mapping
  // await

  // TODO shared process should have no logic, this should probably be somewhere else
  const folder = Env.getFolder()
  if (!folder) {
    const path = join(Root.root, 'playground')
    return {
      path,
      uri: toUri(path),
      workspaceId: getWorkspaceId(path),
      homeDir: Platform.getHomeDir(),
      pathSeparator: Platform.getPathSeparator(),
      source: 'shared-process-env',
    }
  }
  const absolutePath = getAbsolutePath(folder)
  const workspaceId = getWorkspaceId(absolutePath)
  // TODO this slows down startup a lot (~30-50ms)
  // const workspaceStorage = await getWorkspaceStorage(workspaceId)
  return {
    path: absolutePath,
    uri: toUri(absolutePath),
    workspaceId,
    homeDir: Platform.getHomeDir(),
    pathSeparator: Platform.getPathSeparator(),
    source: 'shared-process-default',
  }
}

export const resolveUri = (uri) => {
  const path = fileURLToPath(uri)
  return {
    path,
    uri,
    homeDir: Platform.getHomeDir(),
    pathSeparator: Platform.getPathSeparator(),
  }
}
