import * as AutoUpdateType from '../AutoUpdateType/AutoUpdateType.js'

export const getModule = (type) => {
  switch (type) {
    case AutoUpdateType.AppImage:
      return import('../AutoUpdaterAppImage/AutoUpdaterAppImage.js')
    case AutoUpdateType.WindowsNsis:
      return import('../AutoUpdaterNsis/AutoUpdaterNsis.js')
    case AutoUpdateType.Deb:
      return import('../AutoUpdaterDeb/AutoUpdaterDeb.js')
    default:
      return undefined
  }
}
