import * as Command from '../Command/Command.js'
import * as IsAbortError from '../IsAbortError/IsAbortError.js'
import { VError } from '../VError/VError.js'

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
    throw new VError(error, 'Failed to open folder')
  }
}
