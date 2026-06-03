import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'
import * as StaticPath from '../StaticPath/StaticPath.js'

const invalidIconsPath = Path.join(Root.root, 'static', '__missing_vscode_icon__.svg')

export class InvalidRemotePathError extends Error {
  constructor(pathName) {
    super(`Invalid remote path: ${pathName}`)
    this.name = 'InvalidRemotePathError'
  }
}

export const isInvalidRemotePathError = (error) => {
  return error instanceof InvalidRemotePathError
}

const getIconAbsolutePath = (pathName) => {
  const relativePath = pathName.startsWith('/static/icons/') ? pathName.slice('/static/icons/'.length) : pathName.slice('/icons/'.length)
  if (!relativePath || relativePath.includes('/') || relativePath.includes('\\') || relativePath.includes('..')) {
    return invalidIconsPath
  }
  const codiconPath = Path.join(Root.root, 'packages', 'renderer-worker', 'node_modules', '@vscode', 'codicons', 'src', 'icons', relativePath)
  if (existsSync(codiconPath)) {
    return codiconPath
  }
  const staticIconPath = Path.join(Root.root, 'static', 'icons', relativePath)
  if (existsSync(staticIconPath)) {
    return staticIconPath
  }
  return invalidIconsPath
}

const driveLetterPath = /^\/?[A-Za-z]:\//
const driveLetterWithoutSlashPath = /^\/?[A-Za-z]:[^/]/

const getRemoteAbsolutePath = (pathName) => {
  const uri = pathName.slice('/remote'.length)
  if (!uri) {
    throw new InvalidRemotePathError(pathName)
  }
  const normalized = uri.replaceAll('\\', '/')
  if (Platform.isWindows || driveLetterPath.test(normalized) || driveLetterWithoutSlashPath.test(normalized)) {
    if (driveLetterWithoutSlashPath.test(normalized)) {
      throw new InvalidRemotePathError(pathName)
    }
    const normalizedUri = normalized.startsWith('/') ? normalized : `/${normalized}`
    return fileURLToPath(`file://` + normalizedUri)
  }
  return normalized
}

// TODO clean up this code
export const getElectronFileResponseAbsolutePath = (pathName) => {
  // TODO remove if/else in prod (use replacement)
  if (pathName === `/` || pathName.startsWith(`/?`)) {
    const staticPath = StaticPath.getStaticPath()
    return Path.join(staticPath, 'index.html')
  }
  if (pathName.startsWith(`/packages`)) {
    return Path.join(Root.root, pathName)
  }
  if (pathName.startsWith(`/static`)) {
    return Path.join(Root.root, pathName)
  }
  if (pathName.startsWith('/icons/') || pathName.startsWith('/static/icons/')) {
    return getIconAbsolutePath(pathName)
  }
  if (pathName.startsWith(`/extensions`)) {
    return Path.join(Root.root, pathName)
  }
  // TODO maybe have a separate protocol for remote, e.g. vscode has vscode-remote
  if (pathName.startsWith(`/remote`)) {
    return getRemoteAbsolutePath(pathName)
  }
  if (pathName.startsWith('/process-explorer/process-explorer-theme.css')) {
    const processExplorerThemeCss = join(tmpdir(), 'process-explorer-theme.css')
    return processExplorerThemeCss
  }
  // TODO move this to preview process
  if (pathName.startsWith('/home')) {
    return pathName
  }
  const staticPath = StaticPath.getStaticPath()
  return Path.join(staticPath, pathName)
}
