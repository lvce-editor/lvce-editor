const ContentSecurityPolicy = require('../ContentSecurityPolicy/ContentSecurityPolicy.cjs')
const ContentSecurityPolicyWorker = require('../ContentSecurityPolicyWorker/ContentSecurityPolicyWorker.cjs')
const CrossOriginEmbedderPolicy = require('../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.cjs')
const CrossOriginOpenerPolicy = require('../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.cjs')
const ElectronResourceType = require('../ElectronResourceType/ElectronResourceType.cjs')

const handleHeadersReceivedMainFrame = (responseHeaders) => {
  return {
    responseHeaders: {
      ...responseHeaders,
      [ContentSecurityPolicy.key]: ContentSecurityPolicy.value,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    },
  }
}

const handleHeadersReceivedSubFrame = (responseHeaders) => {
  return {
    responseHeaders: {
      ...responseHeaders,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    },
  }
}

const handleHeadersReceivedDefault = (responseHeaders, url) => {
  if (url.endsWith('WorkerMain.js')) {
    return {
      responseHeaders: {
        ...responseHeaders,
        [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
        [ContentSecurityPolicyWorker.key]: ContentSecurityPolicyWorker.value,
      },
    }
  }
  return {
    responseHeaders,
  }
}

const handleHeadersReceivedXhr = (responseHeaders, url) => {
  // workaround for electron bug
  // when using fetch, it doesn't return a response for 404
  // console.log({ url, responseHeaders })
  return {
    responseHeaders: {
      ...responseHeaders,
    },
  }
}

const getHeadersReceivedFunction = (resourceType) => {
  // console.log({ resourceType })
  switch (resourceType) {
    case ElectronResourceType.MainFrame:
      return handleHeadersReceivedMainFrame
    case ElectronResourceType.SubFrame:
      return handleHeadersReceivedSubFrame
    case ElectronResourceType.Xhr:
      return handleHeadersReceivedXhr
    default:
      return handleHeadersReceivedDefault
  }
}

/**
 *
 * @param {import('electron').OnHeadersReceivedListenerDetails} details
 * @param {(headersReceivedResponse: import('electron').HeadersReceivedResponse)=>void} callback
 */
exports.handleHeadersReceived = (details, callback) => {
  const { responseHeaders, resourceType, url } = details
  const fn = getHeadersReceivedFunction(resourceType)
  callback(fn(responseHeaders, url))
}
