import { webContents } from 'electron'

export const getStats = (webContentsId) => {
  const contents = webContents.fromId(webContentsId)
  if (!contents) {
    return undefined
  }
  const canGoBack = contents.canGoBack()
  const canGoForward = contents.canGoForward()
  const url = contents.getURL()
  const title = contents.getTitle()
  return {
    canGoBack,
    canGoForward,
    url,
    title,
  }
}
