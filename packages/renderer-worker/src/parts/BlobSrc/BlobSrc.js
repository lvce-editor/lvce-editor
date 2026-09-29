import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Mime from '../Mime/Mime.js'
import * as Protocol from '../Protocol/Protocol.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getSrc = (uri) => {
  const mimeType = Mime.getMediaMimeType(uri)
  return FileSystem.getBlobUrl(uri, mimeType)
}

export const disposeSrc = async (src) => {
  if (src.startsWith(Protocol.Blob)) {
    await RendererProcess.invoke('ObjectUrl.revoke', src)
  }
}
