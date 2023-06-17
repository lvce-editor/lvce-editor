const AboutStrings = require('../AboutStrings/AboutStrings.js')
const ElectronClipBoard = require('../ElectronClipBoard/ElectronClipBoard.js')
const ElectronDialog = require('../ElectronDialog/ElectronDialog.js')
const ElectronMessageBoxType = require('../ElectronMessageBoxType/ElectronMessageBoxType.js')
const GetAboutDetailString = require('../GetAboutDetailString/GetAboutDetailString.js')
const Platform = require('../Platform/Platform.js')

exports.showAbout = async () => {
  const detail = GetAboutDetailString.getDetailString()
  const result = await ElectronDialog.showMessageBox({
    message: Platform.productNameLong,
    buttons: [AboutStrings.copy(), AboutStrings.ok()],
    type: ElectronMessageBoxType.Info,
    detail,
  })
  switch (result) {
    case 0:
      ElectronClipBoard.writeText(detail)
      break
    case 1:
    default:
      break
  }
}
