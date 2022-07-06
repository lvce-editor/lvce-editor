import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Assert from '../Assert/Assert.js'

export const downloadFile = async (fileName, url) => {
  Assert.string(fileName)
  Assert.string(url)
  await RendererProcess.invoke(
    /* Download.DownloadFile */ 'Download.downloadFile',
    /* fileName */ fileName,
    /* url */ url
  )
}
