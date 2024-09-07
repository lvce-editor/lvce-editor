import * as Assert from '../Assert/Assert.ts'
import * as Json from '../Json/Json.js'
import * as MimeType from '../MimeType/MimeType.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import * as Timeout from '../Timeout/Timeout.js'
import * as Url from '../Url/Url.js'
import { VError } from '../VError/VError.js'

export const downloadFile = async (fileName, url) => {
  Assert.string(fileName)
  Assert.string(url)
  await RendererProcess.invoke(/* Download.downloadFile */ 'Download.downloadFile', /* fileName */ fileName, /* url */ url)
}

export const downloadToDownloadsFolder = async (fileName, url) => {
  const downloadFolder = await PlatformPaths.getDownloadDir()
  const outFile = `${downloadFolder}/${fileName}`
  await SharedProcess.invoke(SharedProcessCommandType.DownloadDownload, /* url */ url, /* outFile */ outFile)
}

export const downloadJson = async (json, fileName) => {
  let url = ''
  try {
    const stringified = Json.stringify(json)
    const blob = new Blob([stringified], {
      type: MimeType.ApplicationJson,
    })
    url = Url.createObjectUrl(blob)
    await downloadFile(fileName, url)
  } catch (error) {
    throw new VError(error, `Failed to download ${fileName}`)
  } finally {
    await Timeout.sleep(0)
    Url.revokeObjectUrl(url)
  }
}

export const downloadUrl = (url, outFile) => {
  Assert.string(url)
  Assert.string(outFile)
  return SharedProcess.invoke('Download.download', url, outFile)
}
