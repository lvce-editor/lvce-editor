import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SavePromptResult from '../SavePromptResult/SavePromptResult.js'

export const prompt = async (message, confirmMessage, title) => {
  const result = await RendererProcess.invoke('ConfirmPrompt.prompt', message)
  return result
}

export const promptSave = async (message, invoke = RendererProcess.invoke) => {
  const shouldSave = await invoke('ConfirmPrompt.prompt', `${message}\n\nSelect OK to save, or Cancel for more options.`)
  if (shouldSave) {
    return SavePromptResult.Save
  }
  const shouldDiscard = await invoke('ConfirmPrompt.prompt', 'Discard your changes? Select OK to discard them, or Cancel to keep editing.')
  return shouldDiscard ? SavePromptResult.Discard : SavePromptResult.Cancel
}
