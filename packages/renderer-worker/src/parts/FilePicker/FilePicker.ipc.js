import * as FilePicker from './FilePicker.js'

export const name = 'FilePicker'

export const Commands = {
  setOpenFolderSupported: FilePicker.setOpenFolderSupported,
  showDirectoryPicker: FilePicker.showDirectoryPicker,
  showFilePicker: FilePicker.showFilePicker,
  showSaveFilePicker: FilePicker.showSaveFilePicker,
  mockSaveFilePicker: FilePicker.mockSaveFilePicker,
}
