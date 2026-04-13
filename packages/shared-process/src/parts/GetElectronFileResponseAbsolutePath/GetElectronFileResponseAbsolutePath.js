import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'
import * as StaticPath from '../StaticPath/StaticPath.js'

const invalidIconsPath = Path.join(Root.root, 'static', '__missing_vscode_icon__.svg')

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
    const uri = pathName.slice('/remote'.length)
    if (Platform.isWindows) {
      return fileURLToPath(`file://` + uri)
    }
    return uri
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
