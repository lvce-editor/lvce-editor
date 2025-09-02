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

export const prompt = async (
  message,
  { confirmMessage = ConfirmPromptStrings.ok(), title = '', cancelMessage = ConfirmPromptStrings.cancel() } = {},
) => {
  if (_mockId) {
    return showMockConfirmPrompt()
  }
  // TODO always ask shared process for prompts
  // when running in electron it uses native prompts
  // when running in node or web it uses browser prompts
  if (Platform.platform === PlatformType.Electron) {
    return ConfirmPromptElectron.prompt(message, confirmMessage, title, cancelMessage)
  }
  return ConfirmPromptWeb.prompt(message, confirmMessage, title)
}

export const mock = (mockId) => {
  _mockId = mockId
}
