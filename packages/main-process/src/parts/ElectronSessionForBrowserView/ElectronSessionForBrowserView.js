const Electron = require('electron')
const { VError } = require('verror')
const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const FileSystem = require('../FileSystem/FileSystem.js')
const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')
const FileSystemErrorCodes = require('../FileSystemErrorCodes/FileSystemErrorCodes.js')
const ElectronResourceType = require('../ElectronResourceType/ElectronResourceType.js')
const HttpMethod = require('../HttpMethod/HttpMethod.js')

const state = {
  /**
   * @type {import('electron').Session|undefined}
   */
  session: undefined,
}

const isAllowedPermission = (permission) => {
  switch (permission) {
    case ElectronPermissionType.ClipBoardRead:
    case ElectronPermissionType.ClipBoardSanitizedWrite:
      return true
    default:
      return false
  }
}

const handlePermissionRequest = (
  webContents,
  permission,
  callback,
  details
) => {
  callback(isAllowedPermission(permission))
}

const handlePermissionCheck = (webContents, permission, origin, details) => {
  return isAllowedPermission(permission)
}

/**
 *
 * @param {Electron.Session} session
 * @param {string } extensionPath
 */
const loadExtension = async (session, extensionPath) => {
  try {
    await session.loadExtension(extensionPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to load chrome extension`)
  }
}

const getChromeExtensionPaths = async () => {
  try {
    const chromeExtensionsPath = Platform.getChromeExtensionsPath()
    const dirents = await FileSystem.readDir(chromeExtensionsPath)
    const extensionsPaths = []
    for (const dirent of dirents) {
      extensionsPaths.push(Path.join(chromeExtensionsPath, dirent))
    }
    return extensionsPaths
  } catch (error) {
    // @ts-ignore
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
      return []
    }
    // @ts-ignore
    throw new VError(error, `Failed to get chrome extensions paths: ${error}`)
  }
}

const addSessionChromeExtensions = async (session) => {
  try {
    const chromeExtensionsPaths = await getChromeExtensionPaths()
    for (const chromeExtensionPath of chromeExtensionsPaths) {
      await loadExtension(session, chromeExtensionPath)
    }
  } catch (error) {
    console.error(error)
  }
}

const getBeforeRequestResponseMainFrame = (url) => {
  return {}
}

const cancelIfStartsWith = (url, canceledUrls) => {
  for (const canceledUrl of canceledUrls) {
    if (url.startsWith(canceledUrl)) {
      return {
        cancel: true,
      }
    }
  }
  return {}
}

const getBeforeRequestResponseXhrPost = (url) => {
  const canceledUrls = [
    'https://www.youtube.com/api/stats/qoe',
    'https://www.youtube.com/youtubei/v1/log_event',
  ]
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhrGet = (url) => {
  const canceledUrls = [
    'https://www.youtube.com/pagead/',
    'https://www.youtube.com/api/stats/qoe',
    'https://www.youtube.com/api/stats/ads',
    'https://www.youtube.com/api/stats/delayplay',
    'https://www.youtube.com/ptracking',
    'https://www.youtube.com/api/timedtext',
    'https://www.youtube.com/pcs/activeview',
  ]
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhrHead = (url) => {
  const canceledUrls = ['https://www.youtube.com/generate_204']
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhr = (method, url) => {
  switch (method) {
    case HttpMethod.Post:
      return getBeforeRequestResponseXhrPost(url)
    case HttpMethod.Get:
      return getBeforeRequestResponseXhrGet(url)
    case HttpMethod.Head:
      return getBeforeRequestResponseXhrHead(url)
    default:
      return {}
  }
}

const getBeforeRequestResponse = (details) => {
  const {
    id,
    method,
    referrer,
    resourceType,
    timestamp,
    uploadData,
    url,
    frame,
  } = details

  switch (resourceType) {
    case ElectronResourceType.MainFrame:
      return getBeforeRequestResponseMainFrame(url)
    case ElectronResourceType.Stylesheet:
      return {}
    case ElectronResourceType.Script:
      return {}
    case ElectronResourceType.Xhr:
      return getBeforeRequestResponseXhr(method, url)
    default:
      return {
        cancel: true,
      }
  }
}

/**
 *
 * @param {Electron.OnBeforeRequestListenerDetails } details
 * @param {(response: globalThis.Electron.CallbackResponse) => void} callback
 */
const handleBeforeRequest = (details, callback) => {
  const response = getBeforeRequestResponse(details)
  if (!response.cancel && details.resourceType === ElectronResourceType.Xhr) {
    console.log({
      resourceType: details.resourceType,
      url: details.url,
      method: details.method,
    })
  }
  callback(response)
}

const createSession = () => {
  const sessionId = `persist:browserView` + Math.random()
  const session = Electron.session.fromPartition(sessionId, {
    cache: true,
  })
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  const filter = {
    urls: ['https://*.youtube.com/*'],
    // urls: ['<all_urls>'],
  }
  session.webRequest.onBeforeRequest(filter, handleBeforeRequest)
  // session.webRequest.addSessionChromeExtensions(session)
  return session
}

exports.getSession = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
