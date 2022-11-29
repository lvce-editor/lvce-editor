import * as Ajax from '../Ajax/Ajax.js'
import * as FilePicker from '../FilePicker/FilePicker.js'
import * as FileSystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import { VError } from '../VError/VError.js'

export const saveFileAs = async (fileName, url) => {
  try {
    const fileHandle = await FilePicker.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: 'Text File',
          accept: {
            'image/png': ['.png'],
          },
        },
      ],
      startIn: 'downloads',
    })
    const response = await Ajax.getResponse(url)
    await FileSystemHandle.writeResponse(fileHandle, response)
  } catch (error) {
    // @ts-ignore
    if (error && error.name === 'AbortError') {
      return
    }
    throw new VError(error, `Failed to save file`)
  }
}
