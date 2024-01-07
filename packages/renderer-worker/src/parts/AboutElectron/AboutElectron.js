import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as GetAboutDetailString from '../GetAboutDetailString/GetAboutDetailString.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as Product from '../Product/Product.js'

export const showAboutElectron = async () => {
  const windowId = await GetWindowId.getWindowId()
  const detail = await GetAboutDetailString.getDetailString()
  const productNameLong = await Product.getProductNameLong()
  const options = {
    windowId,
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
