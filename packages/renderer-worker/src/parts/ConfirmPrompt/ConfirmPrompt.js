import * as ConfirmPromptStrings from '../ConfirmPromptStrings/ConfirmPromptStrings.js'
import * as DialogWorker from '../DialogWorker/DialogWorker.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
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

export const prompt3 = async (message, options = {}) => {
  if (_mockId) {
    const shouldSave = await showMockConfirmPrompt(message, options)
    if (shouldSave) {
      return 'save'
    }
    const shouldDiscard = await showMockConfirmPrompt(options.discardPrompt ?? 'Discard changes?', options)
    return shouldDiscard ? 'discard' : 'cancel'
  }
  if ((options.platform ?? Platform.getPlatform()) === PlatformType.Electron) {
    // A package update can remove the old dialog worker before the running
    // application's close confirmation. Native dialogs need no new worker.
    const result = await ElectronDialog.showMessageBox({
      buttons: [options.confirmMessage ?? 'Save', options.cancelMessage ?? ConfirmPromptStrings.cancel(), options.discardMessage ?? "Don't Save"],
      defaultId: 0,
      message,
      title: options.title ?? '',
      type: 'question',
    })
    return result === 0 ? 'save' : result === 2 ? 'discard' : 'cancel'
  }
  return DialogWorker.invoke('ConfirmPrompt.prompt3', message, options)
}

export const showErrorMessage = ({ message, platform = Platform.getPlatform(), confirmMessage = ConfirmPromptStrings.ok(), title = '' }) => {
  if (_mockId) {
    return showMockConfirmPrompt(message, { confirmMessage, title })
  }
  return DialogWorker.invoke('ConfirmPrompt.showErrorMessage', { confirmMessage, message, platform, title })
}
