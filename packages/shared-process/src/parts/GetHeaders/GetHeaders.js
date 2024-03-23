import { extname } from 'path'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersMainFrame from '../GetHeadersMainFrame/GetHeadersMainFrame.js'
import * as GetHeadersOtherWorker from '../GetHeadersOtherWorker/GetHeadersOtherWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'

const getHeadersDefault = () => {
  return {}
}

const getExtraHeaders = (url, fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return GetHeadersMainFrame.getHeadersMainFrame()
    case '.js':
    case '.ts':
      if (url.endsWith('rendererWorkerMain.js')) {
        return GetHeadersRendererWorker.getHeadersRendererWorker()
      }
      if (url.endsWith('extensionHostWorkerMain.js')) {
        return GetHeadersExtensionHostWorker.getHeadersExtensionHostWorker()
      }
      if (url.endsWith('WorkerMain.js') || url.endsWith('WorkerMain.ts')) {
        return GetHeadersOtherWorker.getHeadersOtherWorker(url)
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
