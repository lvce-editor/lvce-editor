const Electron = require('electron')
const ContentSecurityPolicy = require('../ContentSecurityPolicy/ContentSecurityPolicy.js')
const ContentSecurityPolicyWorker = require('../ContentSecurityPolicyWorker/ContentSecurityPolicyWorker.js')
const CrossOriginEmbedderPolicy = require('../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js')
const CrossOriginOpenerPolicy = require('../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js')
const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')
const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const Root = require('../Root/Root.js')
const ElectronResourceType = require('../ElectronResourceType/ElectronResourceType.js')

const state = {
  /**
   * @type {import('electron').Session|undefined}
   */
  session: undefined,
}

const handleHeadersReceivedMainFrame = (responseHeaders) => {
  return {
    responseHeaders: {
      ...responseHeaders,
      [ContentSecurityPolicy.key]: ContentSecurityPolicy.value,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    },
  }
}

const handleHeadersReceivedSubFrame = (responseHeaders) => {
  return {
    responseHeaders: {
      ...responseHeaders,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    },
  }
}

const handleHeadersReceivedDefault = (responseHeaders, url) => {
  if (url.endsWith('WorkerMain.js')) {
    return {
      responseHeaders: {
        ...responseHeaders,
        [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
        [ContentSecurityPolicyWorker.key]: ContentSecurityPolicyWorker.value,
      },
    }
  }
  return {
    responseHeaders,
  }
}

const getHeadersReceivedFunction = (resourceType) => {
  switch (resourceType) {
    case ElectronResourceType.MainFrame:
      return handleHeadersReceivedMainFrame
    case ElectronResourceType.SubFrame:
      return handleHeadersReceivedSubFrame
    default:
      return handleHeadersReceivedDefault
  }
}

/**
 *
 * @param {import('electron').OnHeadersReceivedListenerDetails} details
 * @param {(headersReceivedResponse: import('electron').HeadersReceivedResponse)=>void} callback
 */
const handleHeadersReceived = (details, callback) => {
  const { responseHeaders, resourceType, url } = details
  const fn = getHeadersReceivedFunction(resourceType)
  callback(fn(responseHeaders, url))
}

const isAllowedPermission = (permission) => {
  switch (permission) {
    case ElectronPermissionType.ClipBoardRead:
    case ElectronPermissionType.ClipBoardSanitizedWrite:
    case ElectronPermissionType.FullScreen:
    case ElectronPermissionType.WindowPlacement:
      return true
    default:
      return false
  }
}

const handlePermissionRequest = (webContents, permission, callback, details) => {
  callback(isAllowedPermission(permission))
}

const handlePermissionCheck = (webContents, permission, origin, details) => {
  return isAllowedPermission(permission)
}

// TODO use Platform.getScheme() instead of Product.getTheme()

const getAbsolutePath = (requestUrl) => {
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
    return pathName.slice('/remote'.length)
  }
  return Path.join(Root.root, 'static', pathName)
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
    cache: Platform.isProduction,
  })
  session.webRequest.onHeadersReceived(handleHeadersReceived)
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  session.protocol.registerFileProtocol(Platform.scheme, handleRequest)
  return session
}

exports.state = state

exports.get = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
