import { extname } from 'path'
import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'
import * as ContentSecurityPolicyWorker from '../ContentSecurityPolicyWorker/ContentSecurityPolicyWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'

const getHeadersMainFrame = () => {
  return {
    [ContentSecurityPolicy.key]: ContentSecurityPolicy.value,
    [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
  }
}

const getHeadersWorker = () => {
  return {
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    [ContentSecurityPolicyWorker.key]: ContentSecurityPolicyWorker.value,
  }
}

const getHeadersDefault = () => {
  return {}
}

const getExtraHeaders = (url, fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return getHeadersMainFrame()
    case '.js':
      if (url.endsWith('WorkerMain.js')) {
        return getHeadersWorker()
      }
      return getHeadersDefault()
    default:
      return getHeadersDefault()
  }
}

export const getHeaders = (absolutePath) => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers = {
    'Content-Type': mime,
  }
  const extraHeaders = getExtraHeaders(absolutePath, extension)
  return {
    ...headers,
    ...extraHeaders,
  }
}
