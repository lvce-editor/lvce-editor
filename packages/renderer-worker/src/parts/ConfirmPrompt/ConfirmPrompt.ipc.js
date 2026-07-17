import * as ConfirmPrompt from './ConfirmPrompt.js'

export const name = 'ConfirmPrompt'

export const Commands = {
  mock: ConfirmPrompt.mock,
  prompt: ConfirmPrompt.prompt,
  promptSave: ConfirmPrompt.promptSave,
  showErrorMessage: ConfirmPrompt.showErrorMessage,
}
