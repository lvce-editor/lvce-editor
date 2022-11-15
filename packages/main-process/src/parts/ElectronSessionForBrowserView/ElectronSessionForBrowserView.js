const Electron = require('electron')
const { VError } = require('verror')
const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const FileSystem = require('../FileSystem/FileSystem.js')
const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')
const FileSystemErrorCodes = require('../FileSystemErrorCodes/FileSystemErrorCodes.js')
const ElectronBrowserViewAdBlock = require('../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js')

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

const createSession = () => {
  const sessionId = `persist:browserView`
  const session = Electron.session.fromPartition(sessionId, {
    cache: true,
  })
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  session.webRequest.onBeforeRequest(
    ElectronBrowserViewAdBlock.filter,
    ElectronBrowserViewAdBlock.handleBeforeRequest
  )
  // session.webRequest.addSessionChromeExtensions(session)
  return session
}

exports.getSession = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
