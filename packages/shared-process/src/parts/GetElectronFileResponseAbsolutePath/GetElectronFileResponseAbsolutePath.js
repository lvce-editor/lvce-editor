import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'

export const getElectronFileResponseAbsolutePath = (pathName) => {
  // TODO remove if/else in prod (use replacement)
  if (pathName === `/` || pathName.startsWith(`/?`)) {
    return Path.join(Root.root, 'static', 'index.html')
  }
  if (pathName.startsWith(`/packages`)) {
    return Path.join(Root.root, pathName)
  }
  if (pathName.startsWith(`/static`)) {
    return Path.join(Root.root, pathName)
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
  return Path.join(Root.root, 'static', pathName)
}
