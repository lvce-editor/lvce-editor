import * as Assert from '../Assert/Assert.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'

export const readText = async () => {
  try {
    return await RendererProcess.invoke('ClipBoard.readText')
  } catch (error) {
    // @ts-ignore
    if (error.message === 'Read permission denied.') {
      throw new VError('Failed to read text from clipboard: The Browser disallowed reading from clipboard')
    }
    if (
      // @ts-ignore
      error.message === 'navigator.clipboard.readText is not a function'
    ) {
      throw new VError('Failed to read text from clipboard: The Clipboard Api is not available in Firefox')
    }
    throw new VError(error, 'Failed to read text from clipboard')
  }
}

export const writeText = async (text) => {
  try {
    Assert.string(text)
    await RendererProcess.invoke('ClipBoard.writeText', /* text */ text)
  } catch (error) {
    throw new VError(error, 'Failed to write text to clipboard')
  }
}

export const writeNativeFiles = async (type, files) => {
  try {
    if (Platform.platform === PlatformType.Web) {
      throw new Error('not supported')
    }
    await SharedProcess.invoke(/* command */ 'ClipBoard.writeFiles', /* type */ type, /* files */ files)
  } catch (error) {
    throw new VError(error, 'Failed to write files to native clipboard')
  }
}

export const readNativeFiles = async () => {
  try {
    if (Platform.platform === PlatformType.Web) {
      throw new Error('not supported')
    }
    return await SharedProcess.invoke(/* command */ 'ClipBoard.readFiles')
  } catch (error) {
    throw new VError(error, 'Failed to read files from native clipboard')
  }
}

export const writeImage = async (blob) => {
  try {
    return await RendererProcess.invoke('ClipBoard.writeImage', blob)
  } catch (error) {
    throw new VError(error, 'Failed to write image to clipboard')
  }
}

export const execCopy = async () => {
  try {
    return await RendererProcess.invoke('ClipBoard.execCopy')
  } catch (error) {
    throw new VError(error, 'Failed to copy selected text')
  }
}
