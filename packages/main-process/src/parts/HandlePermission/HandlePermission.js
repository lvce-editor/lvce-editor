const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')
const Logger = require('../Logger/Logger.js')

const isAllowedPermission = (permission) => {
  switch (permission) {
    case ElectronPermissionType.ClipBoardRead:
    case ElectronPermissionType.ClipBoardSanitizedWrite:
    case ElectronPermissionType.FullScreen:
    case ElectronPermissionType.WindowPlacement:
    case ElectronPermissionType.Media:
      return true
    default:
      return false
  }
}

exports.handlePermissionRequest = (webContents, permission, callback, details) => {
  const isAllowed = isAllowedPermission(permission)
  if (!isAllowed) {
    Logger.info(`[main-process] blocked permission request for ${permission}`)
  }
  callback(isAllowed)
}

exports.handlePermissionCheck = (webContents, permission, origin, details) => {
  const isAllowed = isAllowedPermission(permission)
  return isAllowed
}
