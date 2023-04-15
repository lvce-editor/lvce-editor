const ElectronClipBoard = require('../ElectronClipBoard/ElectronClipBoard.js')
const ElectronDialog = require('../ElectronDialog/ElectronDialog.js')
const ElectronMessageBoxType = require('../ElectronMessageBoxType/ElectronMessageBoxType.js')
const GetAboutDetailString = require('../GetAboutDetailString/GetAboutDetailString.js')
const Platform = require('../Platform/Platform.js')

/**
 * @enum {string}
 */
const UiStrings = {
  Ok: 'Ok',
  Copy: 'Copy',
}

exports.showAbout = async () => {
  const detail = GetAboutDetailString.getDetailString()
  const result = await ElectronDialog.showMessageBox(Platform.productName, [UiStrings.Copy, UiStrings.Ok], ElectronMessageBoxType.Info, detail)
  switch (result) {
    case 0:
      ElectronClipBoard.writeText(detail)
      break
    case 1:
    default:
      break
  }
}
