import * as Assert from '../Assert/Assert.js'
import * as Json from '../Json/Json.js'
import * as MimeType from '../MimeType/MimeType.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import * as Url from '../Url/Url.js'
import { VError } from '../VError/VError.js'

export const downloadFile = async (fileName, url) => {
  Assert.string(fileName)
  Assert.string(url)
  await RendererProcess.invoke(/* Download.downloadFile */ 'Download.downloadFile', /* fileName */ fileName, /* url */ url)
}

export const downloadToDownloadsFolder = async (fileName, url) => {
  const downloadFolder = await Platform.getDownloadDir()
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
    Url.revokeObjectUrl(url)
  }
}
