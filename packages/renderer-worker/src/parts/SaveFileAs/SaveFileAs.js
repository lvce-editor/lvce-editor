import * as Ajax from '../Ajax/Ajax.js'
import * as FilePicker from '../FilePicker/FilePicker.js'
import * as FileSystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as IsAbortError from '../IsAbortError/IsAbortError.js'
import { VError } from '../VError/VError.js'
import * as WellKnownDirectoryType from '../WellKnownDirectoryType/WellKnownDirectoryType.js'

export const saveFileAs = async (fileName, url) => {
  try {
    const fileHandle = await FilePicker.showSaveFilePicker({
      suggestedName: fileName,
      startIn: WellKnownDirectoryType.Downloads,
      types: [
        {
          description: 'Text File',
          accept: {
            'image/png': ['.png'],
          },
        },
      ],
    })
    const response = await Ajax.getResponse(url)
    await FileSystemHandle.writeResponse(fileHandle, response)
  } catch (error) {
    if (IsAbortError.isAbortError(error)) {
      return
    }
    throw new VError(error, `Failed to save file`)
  }
}
