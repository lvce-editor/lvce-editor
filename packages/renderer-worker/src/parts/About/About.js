import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as GetAboutDetailString from '../GetAboutDetailString/GetAboutDetailString.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Product from '../Product/Product.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as AboutElectron from '../AboutElectron/AboutElectron.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const showAboutDefault = async () => {
  await Viewlet.openWidget(ViewletModuleId.About)
}

const getFn = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return AboutElectron.showAboutElectron
    default:
      return showAboutDefault
  }
}

export const showAbout = async () => {
  const fn = getFn()
  await fn()
}
