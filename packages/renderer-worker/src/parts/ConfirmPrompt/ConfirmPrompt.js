import * as ConfirmPromptElectron from '../ConfirmPromptElectron/ConfirmPromptElectron.js'
import * as ConfirmPromptWeb from '../ConfirmPromptWeb/ConfirmPromptWeb.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Cancel: 'Cancel',
  Ok: 'Ok',
}

export const prompt = async (message, { confirmMessage = UiStrings.Ok, title = '', cancelMessage = UiStrings.Cancel } = {}) => {
  if (Platform.platform === PlatformType.Electron) {
    return ConfirmPromptElectron.prompt(message, confirmMessage, title, cancelMessage)
  }
  return ConfirmPromptWeb.prompt(message, confirmMessage, title)
}
