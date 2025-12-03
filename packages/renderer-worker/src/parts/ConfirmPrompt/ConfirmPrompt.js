import * as ConfirmPromptElectron from '../ConfirmPromptElectron/ConfirmPromptElectron.js'
import * as ConfirmPromptWeb from '../ConfirmPromptWeb/ConfirmPromptWeb.js'
import * as Platform from '../Platform/Platform.js'
import * as ConfirmPromptStrings from '../ConfirmPromptStrings/ConfirmPromptStrings.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as TestWorker from '../TestWorker/TestWorker.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

let _mockId = 0

const showMockConfirmPrompt = async (message, options) => {
  const ipc = TestWorker.get()
  const result = await JsonRpc.invoke(ipc, 'Test.executeMock', _mockId, message, options)
  return result
}

export const mock = (mockId) => {
  _mockId = mockId
}

export const prompt = async (
  message,
  { platform = Platform.getPlatform(), confirmMessage = ConfirmPromptStrings.ok(), title = '', cancelMessage = ConfirmPromptStrings.cancel() } = {},
) => {
  if (_mockId) {
    return showMockConfirmPrompt(message, { confirmMessage, title, cancelMessage })
  }
  // TODO always ask shared process for prompts
  // when running in electron it uses native prompts
  // when running in node or web it uses browser prompts
  if (platform === PlatformType.Electron) {
    return ConfirmPromptElectron.prompt(message, confirmMessage, title, cancelMessage)
  }
  return ConfirmPromptWeb.prompt(message, confirmMessage, title)
}

export const showErrorMessage = ({ message, platform = Platform.getPlatform(), confirmMessage = ConfirmPromptStrings.ok(), title = '' }) => {
  if (platform === PlatformType.Electron) {
    return ConfirmPromptElectron.promptError(message, confirmMessage, title)
  }
  // TODO maybe have an alert or a custom dialog here instead
  return ConfirmPromptWeb.prompt(message, confirmMessage, title)
}
