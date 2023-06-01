const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')

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

exports.handlePermissionRequest = (webContents, permission, callback, details) => {
  callback(isAllowedPermission(permission))
}

exports.handlePermissionCheck = (webContents, permission, origin, details) => {
  return isAllowedPermission(permission)
}
