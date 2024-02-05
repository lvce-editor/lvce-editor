import { webContents } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as DisposeWebContents from '../DisposeWebContents/DisposeWebContents.js'

export const getStats = (webContentsId) => {
  Assert.number(webContentsId)
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

export const dispose = (webContentsId) => {
  Assert.number(webContentsId)
  const contents = webContents.fromId(webContentsId)
  if (!contents) {
    return
  }
  DisposeWebContents.disposeWebContents(contents)
}

export const callFunction = (webContentsId, functionName, ...args) => {
  Assert.number(webContentsId)
  Assert.string(functionName)
  const contents = webContents.fromId(webContentsId)
  if (!contents) {
    return
  }
  contents[functionName](...args)
}
