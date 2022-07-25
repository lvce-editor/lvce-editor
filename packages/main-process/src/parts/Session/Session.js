const Electron = require('electron')
const minimist = require('minimist')
const Platform = require('../Platform/Platform.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')

const state = {
  /**
   * @type {import('electron').Session|undefined}
   */
  session: undefined,
}

const CONTENT_SECURITY_POLICY = [
  `default-src 'none'`,
  `img-src 'self' https: data:`,
  `media-src 'none'`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `connect-src 'self' https: ws:`,
  `font-src 'self' https:`,
].join('; ')

/**
 *
 * @param {import('electron').OnHeadersReceivedListenerDetails} details
 * @param {(headersReceivedResponse: import('electron').HeadersReceivedResponse)=>void} callback
 */
const handleHeadersReceived = (details, callback) => {
  switch (details.resourceType) {
    case 'mainFrame':
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': CONTENT_SECURITY_POLICY,
        },
      })
      break
    default:
      callback({
        responseHeaders: details.responseHeaders,
      })
      break
  }
}

const handlePermissionRequest = (
  webContents,
  permission,
  callback,
  details
) => {
  callback(false)
}

const handlePermissionCheck = (webContents, permission, origin, details) => {
  return false
}

// TODO use Platform.getScheme() instead of Product.getTheme()

const getAbsolutePath = (requestUrl) => {
  const scheme = Platform.getScheme()
  // TODO remove if/else in prod (use replacement)
  if (requestUrl === `${scheme}://-/`) {
    return Path.join(Root.root, 'static', 'index-electron.html')
  }
  if (requestUrl.startsWith(`${scheme}://-/packages`)) {
    return Path.join(Root.root, requestUrl.slice(scheme.length + 4))
  }
  if (requestUrl.startsWith(`${scheme}://-/static`)) {
    return Path.join(Root.root, requestUrl.slice(scheme.length + 4))
  }
  if (requestUrl.startsWith(`${scheme}://-/extensions`)) {
    return Path.join(Root.root, requestUrl.slice(scheme.length + 4))
  }
  // TODO maybe have a separate protocol for remote, e.g. vscode has vscode-remote
  if (requestUrl.startsWith(`${scheme}://-/remote`)) {
    return requestUrl.slice(scheme.length + 4 + '/remote'.length)
  }
  return Path.join(Root.root, 'static', requestUrl.slice(scheme.length + 4))
}
/**
 *
 * @param {globalThis.Electron.ProtocolRequest} request
 * @param {(response: string | globalThis.Electron.ProtocolResponse) => void} callback
 */

const handleRequest = (request, callback) => {
  // const path = join(__dirname, request.url.slice(6))
  const path = getAbsolutePath(request.url)
  // console.log(request.url, '->', path)
  callback({
    path,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable', // TODO caching is not working, see https://github.com/electron/electron/issues/27075 and https://github.com/electron/electron/issues/23482
    },
  })
}

const createSession = () => {
  const sessionId = Platform.getSessionId()
  const session = Electron.session.fromPartition(sessionId, {
    cache: Platform.isProduction(),
  })
  session.webRequest.onHeadersReceived(handleHeadersReceived)
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  session.protocol.registerFileProtocol(Platform.getScheme(), handleRequest)
  return session
}

exports.state = state

exports.get = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
