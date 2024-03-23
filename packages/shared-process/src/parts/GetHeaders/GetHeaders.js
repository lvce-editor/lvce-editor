import { extname } from 'path'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersMainFrame from '../GetHeadersMainFrame/GetHeadersMainFrame.js'
import * as GetHeadersOtherWorker from '../GetHeadersOtherWorker/GetHeadersOtherWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'

const getHeadersDefault = () => {
  return {}
}

const getExtraHeaders = (pathName, fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return GetHeadersMainFrame.getHeadersMainFrame()
    case '.js':
    case '.ts':
      if (pathName.endsWith('rendererWorkerMain.js')) {
        return GetHeadersRendererWorker.getHeadersRendererWorker()
      }
      if (pathName.endsWith('extensionHostWorkerMain.js')) {
        return GetHeadersExtensionHostWorker.getHeadersExtensionHostWorker()
      }
      if (pathName.endsWith('WorkerMain.js') || pathName.endsWith('WorkerMain.ts')) {
        return GetHeadersOtherWorker.getHeadersOtherWorker(pathName)
      }
      return getHeadersDefault()
    default:
      return getHeadersDefault()
  }
}

export const getHeaders = (absolutePath, pathName) => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers = {
    'Content-Type': mime,
  }
  const extraHeaders = getExtraHeaders(pathName, extension)
  return {
    ...headers,
    ...extraHeaders,
  }
}
