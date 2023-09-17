import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const prompt = (message, defaultValue) => {
  return RendererProcess.invoke('Prompt.prompt', message, defaultValue)
}
