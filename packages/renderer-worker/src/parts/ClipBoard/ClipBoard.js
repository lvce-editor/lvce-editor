import * as ClipBoardWorker from '../ClipBoardWorker/ClipBoardWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

export const readText = async () => {
  return await ClipBoardWorker.invoke('ClipBoard.readText')
}

export const writeText = async (text) => {
  return await ClipBoardWorker.invoke('ClipBoard.writeText', text)
}

export const enableMemoryClipBoard = async () => {
  return await ClipBoardWorker.invoke('ClipBoard.enableMemoryClipBoard')
}

export const disableMemoryClipBoard = async () => {
  return await ClipBoardWorker.invoke('ClipBoard.disableMemoryClipBoard')
}

export const hotReload = async () => {
  return await ClipBoardWorker.invoke('ClipBoard.hotReload')
}

export const writeNativeFiles = async (type, files) => {
  return await ClipBoardWorker.invoke('ClipBoard.writeNativeFiles', type, files)
}

export const readNativeFiles = async () => {
  return await ClipBoardWorker.invoke('ClipBoard.readNativeFiles')
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
