import * as GetColorPickerWorkerUrl from '../GetColorPickerWorkerUrl/GetColorPickerWorkerUrl.js'
import * as GetExtensionHostSubWorkerUrl from '../GetExtensionHostSubWorkerUrl/GetExtensionHostSubWorkerUrl.js'
import * as GetRenameWorkerUrl from '../GetRenameWorkerUrl/GetRenameWorkerUrl.js'
import * as IpcParent from '../IpcParent/IpcParent.js'

export const name = 'IpcParent'

const wrappedCreate = (options) => {
  // TODO
  if (options && options.url && options.url.endsWith('extensionHostSubWorkerMain.js')) {
    options.url = GetExtensionHostSubWorkerUrl.getExtensionHostSubWorkerUrl()
  }
  // TODO
  if (options && options.url && options.url.endsWith('colorPickerWorkerMain.js')) {
    options.url = GetColorPickerWorkerUrl.getColorPickerWorkerUrl()
  }
  if (options && options.url && options.url.endsWith('renameWorkerMain.js')) {
    options.url = GetRenameWorkerUrl.getRenameWorkerUrl()
  }
  return IpcParent.create(options)
}

export const Commands = {
  create: wrappedCreate,
}
