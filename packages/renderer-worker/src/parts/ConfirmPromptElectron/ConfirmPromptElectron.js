import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'

export const prompt = async (message, confirmMessage, title, cancelMessage) => {
  const result = await ElectronDialog.showMessageBox({
    message,
    buttons: [cancelMessage, confirmMessage],
    defaultId: 1,
    type: ElectronMessageBoxType.Question,
    title,
  })
  return result === 1
}
