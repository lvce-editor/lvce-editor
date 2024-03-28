import * as Electron from 'electron'
import { VError } from '../VError/VError.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ElectronPermissionType from '../ElectronPermissionType/ElectronPermissionType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Logger from '../Logger/Logger.js'
import * as ElectronBrowserViewAdBlock from '../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js'

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
    case ElectronPermissionType.WindowPlacement:
    case ElectronPermissionType.FullScreen:
    case ElectronPermissionType.GeoLocation:
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
    if (error && error.code === ErrorCodes.ENOENT) {
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
    Logger.error(error)
  }
}

const createSession = () => {
  const sessionId = `persist:browserView`
  const session = Electron.session.fromPartition(sessionId, {
    cache: true,
  })
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  session.webRequest.onBeforeRequest(ElectronBrowserViewAdBlock.filter, ElectronBrowserViewAdBlock.handleBeforeRequest)
  // session.webRequest.addSessionChromeExtensions(session)
  return session
}

export const getSession = () => {
  state.session ||= createSession()
  return state.session
}
