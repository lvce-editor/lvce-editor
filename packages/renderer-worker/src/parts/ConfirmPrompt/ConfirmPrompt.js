import * as ConfirmPromptStrings from '../ConfirmPromptStrings/ConfirmPromptStrings.js'
import * as DialogWorker from '../DialogWorker/DialogWorker.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as TestWorker from '../TestWorker/TestWorker.js'

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
  return DialogWorker.invoke('ConfirmPrompt.prompt', message, { cancelMessage, confirmMessage, platform, title })
}

export const showErrorMessage = ({ message, platform = Platform.getPlatform(), confirmMessage = ConfirmPromptStrings.ok(), title = '' }) => {
  return DialogWorker.invoke('ConfirmPrompt.showErrorMessage', { confirmMessage, message, platform, title })
}
