import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const tokenizeCodeBlock = (displayString: string, languageId: string) => {
  return RendererWorker.invoke('TokenizeCodeBlock.tokenizeCodeBlock', displayString, languageId)
}
