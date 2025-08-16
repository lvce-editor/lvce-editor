import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TestWorker from '../TestWorker/TestWorker.js'

export const showDirectoryPicker = async (options) => {
  try {
    return await RendererProcess.invoke('FilePicker.showDirectoryPicker', options)
  } catch (error) {
    if (
      error &&
      // @ts-ignore
      error.message === 'window.showDirectoryPicker is not a function'
    ) {
      throw new Error('showDirectoryPicker not supported on this browser')
    }
    throw error
  }
}

export const showFilePicker = (options) => {
  return RendererProcess.invoke('FilePicker.showFilePicker', options)
}

const doShowSaveFilePicker = async (options) => {
  try {
    return await RendererProcess.invoke('FilePicker.showSaveFilePicker', options)
  } catch (error) {
    if (
      error &&
      // @ts-ignore
      error.message === 'window.showSaveFilePicker is not a function'
    ) {
      throw new Error('showSaveFilePicker not supported on this browser')
    }
    throw error
  }
}

let _mockId = 0

const doShowMockSaveFilePicker = async () => {
  const ipc = TestWorker.get()
  const result = await JsonRpc.invoke(ipc)
  return result
}

export const showSaveFilePicker = async (options) => {
  if (_mockId) {
    return doShowMockSaveFilePicker()
  }
  return doShowSaveFilePicker(options)
}

export const mockSaveFilePicker = async (mockId) => {
  _mockId = mockId
}
