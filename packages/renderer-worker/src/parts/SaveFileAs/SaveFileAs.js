import * as FilePicker from '../FilePicker/FilePicker.js'
import * as FileHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as Ajax from '../Ajax/Ajax.js'

export const saveFileAs = async (fileName, url) => {
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
  })
  const response = await Ajax.getResponse(url)
  console.log({ response })
  await FileHandle.writeResponse(fileHandle, response)
}
