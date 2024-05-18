import * as Assert from '../Assert/Assert.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import { VError } from '../VError/VError.js'

export const readText = async () => {
  try {
    return await RendererWorker.invoke('ClipBoard.readText')
  } catch (error) {
    // @ts-ignore
    if (error.message === 'Read permission denied.') {
      // @ts-ignore
      throw new VError('Failed to read text from clipboard: The Browser disallowed reading from clipboard')
    }
    if (
      // @ts-ignore
      error.message === 'navigator.clipboard.readText is not a function'
    ) {
      // @ts-ignore
      throw new VError('Failed to read text from clipboard: The Clipboard Api is not available in Firefox')
    }
    throw new VError(error, 'Failed to read text from clipboard')
  }
}

export const writeText = async (text) => {
  try {
    Assert.string(text)
    await RendererWorker.invoke('ClipBoard.writeText', /* text */ text)
  } catch (error) {
    throw new VError(error, 'Failed to write text to clipboard')
  }
}

export const execCopy = async () => {
  try {
    return await RendererWorker.invoke('ClipBoard.execCopy')
  } catch (error) {
    throw new VError(error, 'Failed to copy selected text')
  }
}
