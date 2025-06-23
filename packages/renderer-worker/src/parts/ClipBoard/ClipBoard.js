import * as ClipBoardWorker from '../ClipBoardWorker/ClipBoardWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'

export const readText = async () => {
  return await ClipBoardWorker.invoke('ClipBoard.readText')
}

export const writeText = async (text) => {
  return await ClipBoardWorker.invoke('ClipBoard.writeText', text)
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
