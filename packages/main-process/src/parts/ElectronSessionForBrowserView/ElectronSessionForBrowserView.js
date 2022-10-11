const Electron = require('electron')

const state = {
  /**
   * @type {import('electron').Session|undefined}
   */
  session: undefined,
}

const isAllowedPermission = (permission) => {
  switch (permission) {
    case 'clipboard-read':
    case 'clipboard-sanitized-write':
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

const createSession = () => {
  const session = Electron.session.fromPartition('persist:browserView', {
    cache: true,
  })
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
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
    return { action: 'allow' }
  }
  console.info(`[main-process] blocked popup for ${url}`)
  return {
    action: 'deny',
  }
}
