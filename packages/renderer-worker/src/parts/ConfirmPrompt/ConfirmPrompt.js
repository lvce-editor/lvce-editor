import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Cancel: 'Cancel',
  Ok: 'Ok',
}

const promptElectron = async (message, confirmMessage, title) => {
  const result = await ElectronDialog.showMessageBox({
    message,
    buttons: [UiStrings.Cancel, confirmMessage],
    type: ElectronMessageBoxType.Question,
    title,
  })
  return result === 1
}

const promptWeb = async (message, confirmMessage, title) => {
  const result = await RendererProcess.invoke('ConfirmPrompt.prompt', message)
  return result
}

export const prompt = async (message, { confirmMessage = UiStrings.Ok, title = '' } = {}) => {
  if (Platform.platform === PlatformType.Electron) {
    return promptElectron(message, confirmMessage, title)
  }
  return promptWeb(message, confirmMessage, title)
}
