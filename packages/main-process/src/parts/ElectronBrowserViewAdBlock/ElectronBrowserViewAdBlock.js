import * as Electron from 'electron'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as ElectronResourceType from '../ElectronResourceType/ElectronResourceType.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as HttpMethod from '../HttpMethod/HttpMethod.js'
import * as Root from '../Root/Root.js'

const getBeforeRequestResponseMainFrame = (method, url) => {
  return {}
}

const cancelIfStartsWith = (url, canceledUrls) => {
  for (const canceledUrl of canceledUrls) {
    if (url.startsWith(canceledUrl)) {
      return {
        cancel: true,
      }
    }
  }
  return {}
}

const getBeforeRequestResponseXhrPost = (url) => {
  const canceledUrls = ['https://www.youtube.com/api/stats/qoe', 'https://www.youtube.com/youtubei/v1/log_event', 'https://play.google.com/log']
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhrGet = (url) => {
  const canceledUrls = [
    'https://www.youtube.com/pagead/',
    'https://www.youtube.com/api/stats/qoe',
    'https://www.youtube.com/api/stats/ads',
    'https://www.youtube.com/api/stats/delayplay',
    'https://www.youtube.com/ptracking',
    'https://www.youtube.com/api/timedtext',
    'https://www.youtube.com/pcs/activeview',
    'https://googleads.g.doubleclick.net/pagead/id',
  ]
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhrOptions = (url) => {
  const canceledUrls = ['https://play.google.com/log']
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhrHead = (url) => {
  const canceledUrls = ['https://www.youtube.com/generate_204']
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhr = (method, url) => {
  switch (method) {
    case HttpMethod.Post:
      return getBeforeRequestResponseXhrPost(url)
    case HttpMethod.Get:
      return getBeforeRequestResponseXhrGet(url)
    case HttpMethod.Head:
      return getBeforeRequestResponseXhrHead(url)
    case HttpMethod.Options:
      return getBeforeRequestResponseXhrOptions(url)
    default:
      return {}
  }
}

const getBeforeRequestResponseDefault = (method, url) => {
  return {}
}

const getBeforeRequestResponseScript = (method, url) => {
  const canceledUrls = ['https://static.doubleclick.net']
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponse = (details) => {
  const { method, resourceType, url } = details
  switch (resourceType) {
    case ElectronResourceType.MainFrame:
      return getBeforeRequestResponseMainFrame(method, url)
    case ElectronResourceType.Script:
      return getBeforeRequestResponseScript(method, url)
    case ElectronResourceType.Xhr:
      return getBeforeRequestResponseXhr(method, url)
    default:
      return getBeforeRequestResponseDefault(method, url)
  }
}

/**
 *
 * @param {Electron.OnBeforeRequestListenerDetails } details
 * @param {(response: globalThis.Electron.CallbackResponse) => void} callback
 */
export const handleBeforeRequest = (details, callback) => {
  const response = getBeforeRequestResponse(details)
  if (!response.cancel && details.resourceType === ElectronResourceType.Xhr) {
    // console.log({
    //   resourceType: details.resourceType,
    //   url: details.url,
    //   method: details.method,
    // })
  }
  callback(response)
}

export const filter = {
  // urls: ['https://*.youtube.com/*'],
  urls: ['<all_urls>'],
}

/**
 *
 * @param {Electron.WebContents} webContents
 */
export const enableForWebContents = (webContents) => {
  const handleDidNavigate = () => {
    const resourcesPath = join(Root.root, 'packages', 'main-process', 'src', 'parts', 'ElectronBrowserViewAdBlock')
    const blockJs = readFileSync(join(resourcesPath, './block.js'), 'utf8')
    webContents.executeJavaScript(blockJs)
    const blockCss = readFileSync(join(resourcesPath, './block.css'), 'utf8')
    webContents.insertCSS(blockCss)
  }
  webContents.on(ElectronWebContentsEventType.DidNavigate, handleDidNavigate)
}
