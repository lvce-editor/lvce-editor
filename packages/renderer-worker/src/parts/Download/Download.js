import * as Assert from '../Assert/Assert.js'
import * as Json from '../Json/Json.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'
import * as Url from '../Url/Url.js'

export const downloadFile = async (fileName, url) => {
  Assert.string(fileName)
  Assert.string(url)
  await RendererProcess.invoke(
    /* Download.DownloadFile */ 'Download.downloadFile',
    /* fileName */ fileName,
    /* url */ url
  )
}

export const downloadJson = async (json, fileName) => {
  let url = ''
  try {
    const stringified = Json.stringify(json)
    const blob = new Blob([stringified], {
      type: 'application/json',
    })
    url = Url.createObjectUrl(blob)
    await downloadFile(fileName, url)
  } catch (error) {
    throw new VError(error, `Failed to download ${fileName}`)
  } finally {
    Url.revokeObjectUrl(url)
  }
}
