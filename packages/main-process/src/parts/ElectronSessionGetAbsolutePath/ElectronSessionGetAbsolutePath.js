const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const { fileURLToPath } = require('node:url')
const Root = require('../Root/Root.js')
const { join } = require('node:path')
const { tmpdir } = require('node:os')

exports.getAbsolutePath = (requestUrl) => {
  const decoded = decodeURI(requestUrl)
  const { scheme } = Platform
  const pathName = decoded.slice(`${scheme}://-`.length)
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
  console.log({ pathName })
  return Path.join(Root.root, 'static', pathName)
}
