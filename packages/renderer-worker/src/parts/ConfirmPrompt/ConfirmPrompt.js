import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Cancel: 'Cancel',
  Ok: 'Ok',
}

const promptElectron = async (message, confirmMessage) => {
  const result = await ElectronDialog.showMessageBox(message, [UiStrings.Cancel, confirmMessage], ElectronMessageBoxType.Question)
  return result === 1
}

const promptWeb = (message, confirmMessage) => {
  // TODO ask renderer process to show confirm dialog
  throw new Error('not implemented')
}

export const prompt = async (message, confirmMessage = UiStrings.Ok) => {
  if (Platform.platform === PlatformType.Electron) {
    return promptElectron(message, confirmMessage)
  }
  return promptWeb(message, confirmMessage)
}
