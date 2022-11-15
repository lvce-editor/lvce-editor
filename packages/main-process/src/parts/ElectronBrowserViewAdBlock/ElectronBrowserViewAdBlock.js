const Electron = require('electron')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const ElectronResourceType = require('../ElectronResourceType/ElectronResourceType.js')
const HttpMethod = require('../HttpMethod/HttpMethod.js')

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
  const canceledUrls = [
    'https://www.youtube.com/api/stats/qoe',
    'https://www.youtube.com/youtubei/v1/log_event',
    'https://play.google.com/log',
  ]
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

const getBeforeRequestResponseImage = (method, url) => {
  return {}
}

const getBeforeRequestResponseFont = (method, url) => {
  return {}
}

const getBeforeRequestResponseMedia = (method, url) => {
  return {}
}

const getBeforeRequestResponseScript = (method, url) => {
  const canceledUrls = ['https://static.doubleclick.net']
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponse = (details) => {
  const {
    id,
    method,
    referrer,
    resourceType,
    timestamp,
    uploadData,
    url,
    frame,
  } = details

  switch (resourceType) {
    case ElectronResourceType.MainFrame:
      return getBeforeRequestResponseMainFrame(method, url)
    case ElectronResourceType.Stylesheet:
      return {}
    case ElectronResourceType.Script:
      return getBeforeRequestResponseScript(method, url)
    case ElectronResourceType.Xhr:
      return getBeforeRequestResponseXhr(method, url)
    case ElectronResourceType.Image:
      return getBeforeRequestResponseImage(method, url)
    case ElectronResourceType.Font:
      return getBeforeRequestResponseFont(method, url)
    case ElectronResourceType.Media:
      return getBeforeRequestResponseMedia(method, url)
    default:
      console.log({ resourceType })
      return {}
  }
}

/**
 *
 * @param {Electron.OnBeforeRequestListenerDetails } details
 * @param {(response: globalThis.Electron.CallbackResponse) => void} callback
 */
exports.handleBeforeRequest = (details, callback) => {
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

exports.filter = {
  // urls: ['https://*.youtube.com/*'],
  urls: ['<all_urls>'],
}

/**
 *
 * @param {Electron.Event} event
 */
const handleDidNavigate = (event) => {
  const webContents = event.sender
  const blockJs = readFileSync(join(__dirname, './block.js'), 'utf8')
  webContents.executeJavaScript(blockJs)
  const blockCss = readFileSync(join(__dirname, './block.css'), 'utf8')
  webContents.insertCSS(blockCss)
}

/**
 *
 * @param {Electron.WebContents} webContents
 */
exports.enableForWebContents = (webContents) => {
  webContents.on('did-navigate', handleDidNavigate)
}
