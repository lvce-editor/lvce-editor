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

export const downloadJson = async (json, fileName) => {
  let url = ''
  try {
    const stringified = JSON.stringify(json, null, 2)
    const blob = new Blob([stringified], {
      type: 'application/json',
    })
    url = URL.createObjectURL(blob)
    await downloadFile(fileName, url)
  } catch (error) {
    throw new Error(`Failed to download ${fileName}`, {
      // @ts-ignore
      cause: error,
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
