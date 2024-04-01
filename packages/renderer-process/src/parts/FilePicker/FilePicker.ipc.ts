import * as FilePicker from './FilePicker.ts'

export const name = 'FilePicker'

export const Commands = {
  showDirectoryPicker: FilePicker.showDirectoryPicker,
  showFilePicker: FilePicker.showFilePicker,
  showSaveFilePicker: FilePicker.showSaveFilePicker,
}
