import * as Command from '../Command/Command.js'

export const getText = (file) => {
  return file.text()
}

export const getBinaryString = (file) => {
  return Command.execute('Blob.blobToBinaryString', file)
}
