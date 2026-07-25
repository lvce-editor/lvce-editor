import * as Command from '../Command/Command.js'
import * as IsAbortError from '../IsAbortError/IsAbortError.js'
import { VError } from '../VError/VError.js'

const isDirectoryPickerNotSupportedError = (error) => {
  return error instanceof Error && error.message === 'showDirectoryPicker not supported on this browser'
}

export const openFolder = async () => {
  try {
    const result = await Command.execute('FilePicker.showDirectoryPicker', {
      startIn: 'pictures',
      mode: 'readwrite',
    })
    const uri = `html:///${result.name}`
    await Command.execute('PersistentFileHandle.addHandle', uri, result)
    await Command.execute('Workspace.setPath', uri)
  } catch (error) {
    if (IsAbortError.isAbortError(error)) {
      return
    }
    if (isDirectoryPickerNotSupportedError(error)) {
      await Command.execute('Dialog.showWarning', {
        message: "Your browser doesn't support opening local folders.",
        title: 'Opening Local Folders is Unsupported',
      })
      return
    }
    throw new VError(error, 'Failed to open folder')
  }
}
