const Electron = require('electron')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const ElectronResourceType = require('../ElectronResourceType/ElectronResourceType.js')
const HttpMethod = require('../HttpMethod/HttpMethod.js')

const getBeforeRequestResponseMainFrame = (url) => {
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
  ]
  return cancelIfStartsWith(url, canceledUrls)
}

const getBeforeRequestResponseXhrHead = (url) => {
  const canceledUrls = [
    // 'https://www.youtube.com/generate_204'
  ]
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
    default:
      return {}
  }
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
      return getBeforeRequestResponseMainFrame(url)
    case ElectronResourceType.Stylesheet:
      return {}
    case ElectronResourceType.Script:
      return {}
    case ElectronResourceType.Xhr:
      return getBeforeRequestResponseXhr(method, url)
    default:
      return {
        cancel: true,
      }
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
  urls: ['https://*.youtube.com/*'],
  // urls: ['<all_urls>'],
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
