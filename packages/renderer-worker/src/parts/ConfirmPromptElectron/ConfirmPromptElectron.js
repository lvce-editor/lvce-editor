import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'

export const prompt = async (message, confirmMessage, title, cancelMessage) => {
  const windowId = await GetWindowId.getWindowId()
  const result = await ElectronDialog.showMessageBox({
    windowId,
    message,
    buttons: [cancelMessage, confirmMessage],
    type: ElectronMessageBoxType.Question,
    title,
  })
  return result === 1
}
