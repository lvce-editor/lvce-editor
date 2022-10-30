const Electron = require('electron')
const { VError } = require('verror')
const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const FileSystem = require('../FileSystem/FileSystem.js')
const ElectronWindowOpenActionType = require('../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js')
const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')
const FileSystemErrorCodes = require('../FileSystemErrorCodes/FileSystemErrorCodes.js')

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
    console.log({ chromeExtensionsPaths })
  } catch (error) {
    console.error(error)
  }
}

const createSession = () => {
  const session = Electron.session.fromPartition('persist:browserView', {
    cache: true,
  })
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  addSessionChromeExtensions(session)

  // const extensionPath = Path.join(
  //   Root.root,
  //   'packages',
  //   'electron-browser-view-chrome-extensions',
  //   'ublock'
  // )
  // loadExtension(session, extensionPath)
  return session
}

exports.getSession = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}

/**
 *
 * @type {(details: Electron.HandlerDetails) => ({action: 'deny'}) | ({action: 'allow', overrideBrowserWindowOptions?: Electron.BrowserWindowConstructorOptions})} param0
 * @returns
 */
exports.handleWindowOpen = ({ url }) => {
  if (url === 'about:blank') {
    return { action: ElectronWindowOpenActionType.Allow }
  }
  console.info(`[main-process] blocked popup for ${url}`)
  return {
    action: ElectronWindowOpenActionType.Deny,
  }
}
