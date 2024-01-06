import * as Character from '../Character/Character.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as GetRemoteSrc from '../GetRemoteSrc/GetRemoteSrc.js'
import * as Protocol from '../Protocol/Protocol.js'

const getSrcWithBlobUrl = async (uri) => {
  const content = await FileSystem.readFile(uri)
  const mimeType = await Command.execute('Mime.getMediaMimeType', uri)
  const blob = await Command.execute('Blob.binaryStringToBlob', content, mimeType)
  const dataUrl = await Command.execute('Url.createObjectUrl', blob)
  return dataUrl
}

const canUseRemoteLoading = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  return protocol === Character.EmptyString
}

export const getSrc = (uri) => {
  if (canUseRemoteLoading(uri)) {
    return GetRemoteSrc.getRemoteSrc(uri)
  }
  return getSrcWithBlobUrl(uri)
}

export const disposeSrc = async (src) => {
  if (src.startsWith(Protocol.Blob)) {
    await Command.execute('Url.revokeObjectUrl', src)
  }
}
