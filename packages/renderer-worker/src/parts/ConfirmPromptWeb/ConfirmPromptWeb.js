import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const prompt = async (message, confirmMessage, title) => {
  const result = await RendererProcess.invoke('ConfirmPrompt.prompt', message)
  return result
}
