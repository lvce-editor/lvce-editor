import * as ConfirmPromptElectron from '../ConfirmPromptElectron/ConfirmPromptElectron.js'
import * as ConfirmPromptWeb from '../ConfirmPromptWeb/ConfirmPromptWeb.js'
import * as Platform from '../Platform/Platform.js'
import * as ConfirmPromptStrings from '../ConfirmPromptStrings/ConfirmPromptStrings.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const prompt = async (
  message,
  { confirmMessage = ConfirmPromptStrings.ok(), title = '', cancelMessage = ConfirmPromptStrings.cancel() } = {},
) => {
  // TODO always ask shared process for prompts
  // when running in electron it uses native prompts
  // when running in node or web it uses browser prompts
  if (Platform.platform === PlatformType.Electron) {
    return ConfirmPromptElectron.prompt(message, confirmMessage, title, cancelMessage)
  }
  return ConfirmPromptWeb.prompt(message, confirmMessage, title)
}
