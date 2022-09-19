import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const showDirectoryPicker = (options) => {
  return RendererProcess.invoke('FilePicker.showDirectoryPicker', options)
}

export const showFilePicker = (options) => {
  return RendererProcess.invoke('FilePicker.showFilePicker', options)
}

export const showSaveFilePicker = (options) => {
  return RendererProcess.invoke('FilePicker.showSaveFilePicker', options)
}
