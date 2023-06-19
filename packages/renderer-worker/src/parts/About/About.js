import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as GetAboutDetailString from '../GetAboutDetailString/GetAboutDetailString.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const showAboutDefault = async () => {
  Logger.warn('show about - not implemented')
}

const showAboutElectron = async () => {
  const detail = await GetAboutDetailString.getDetailString()
  const productNameLong = await GetAboutDetailString.getProductNameLong()
  const options = {
    message: productNameLong,
    buttons: [AboutStrings.copy(), AboutStrings.ok()],
    type: ElectronMessageBoxType.Info,
    detail,
  }
  const index = await ElectronDialog.showMessageBox(options)
  switch (index) {
    case 0:
      await ClipBoard.writeText(detail)
      break
    default:
      break
  }
}

const getFn = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return showAboutElectron
    default:
      return showAboutDefault
  }
}

export const showAbout = async () => {
  const fn = getFn()
  await fn()
}
