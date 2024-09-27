import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Protocol from '../Protocol/Protocol.js'

export const getSrc = (uri) => {
  return FileSystem.getBlobUrl(uri)
}

export const disposeSrc = async (src) => {
  if (src.startsWith(Protocol.Blob)) {
    await Command.execute('Url.revokeObjectUrl', src)
  }
}
