import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const showDirectoryPicker = async (options) => {
  try {
    return await RendererProcess.invoke(
      'FilePicker.showDirectoryPicker',
      options
    )
  } catch (error) {
    if (
      error &&
      // @ts-ignore
      error.message === 'window.showDirectoryPicker is not a function'
    ) {
      throw new Error(`showDirectoryPicker not supported on this browser`)
    }
    throw error
  }
}

export const showFilePicker = (options) => {
  return RendererProcess.invoke('FilePicker.showFilePicker', options)
}

export const showSaveFilePicker = (options) => {
  return RendererProcess.invoke('FilePicker.showSaveFilePicker', options)
}
