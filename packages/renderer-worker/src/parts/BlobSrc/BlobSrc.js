import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Procotol from '../Protocol/Protocol.js'

const getSrcRemote = (uri) => {
  const src = `/remote${uri}`
  return src
}

const getSrcWithBlobUrl = async (uri) => {
  const content = await FileSystem.readFile(uri)
  const mimeType = await Command.execute('Mime.getMediaMimeType', uri)
  const blob = await Command.execute(
    'Blob.binaryStringToBlob',
    content,
    mimeType
  )
  const dataUrl = await Command.execute('Url.createObjectUrl', blob)
  return dataUrl
}

const canUseRemoteLoading = (uri) => {
  const protocol = FileSystem.getProtocol(uri)
  return protocol === ''
}

export const getSrc = (uri) => {
  if (canUseRemoteLoading(uri)) {
    return getSrcRemote(uri)
  }
  return getSrcWithBlobUrl(uri)
}

export const disposeSrc = async (src) => {
  if (src.startsWith(Procotol.Blob)) {
    await Command.execute('Url.revokeObjectUrl', src)
  }
}
