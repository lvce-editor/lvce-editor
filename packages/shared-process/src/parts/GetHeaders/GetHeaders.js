import { extname } from 'path'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersEmbedsWorker from '../GetHeadersEmbedsWorker/GetHeadersEmbedsWorker.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersMainFrame from '../GetHeadersMainFrame/GetHeadersMainFrame.js'
import * as GetHeadersOtherWorker from '../GetHeadersOtherWorker/GetHeadersOtherWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersSyntaxHighlightingWorker from '../GetHeadersSyntaxHighlightingWorker/GetHeadersSyntaxHighlightingWorker.js'
import * as GetHeadersTerminalWorker from '../GetHeadersTerminalWorker/GetHeadersTerminalWorker.js'
import * as GetHeadersTestWorker from '../GetHeadersTestWorker/GetHeadersTestWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

const getExtraHeaders = (pathName, fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return GetHeadersMainFrame.getHeadersMainFrame()
    case '.js':
    case '.ts':
      if (pathName.endsWith('testWorkerMain.js') || pathName.endsWith('testWorkerMain.ts')) {
        return GetHeadersTestWorker.getHeadersExtensionHostWorker()
      }
      if (pathName.endsWith('rendererWorkerMain.js') || pathName.endsWith('rendererWorkerMain.ts')) {
        return GetHeadersRendererWorker.getHeadersRendererWorker()
      }
      if (pathName.endsWith('extensionHostWorkerMain.js') || pathName.endsWith('extensionHostWorkerMain.ts')) {
        return GetHeadersExtensionHostWorker.getHeadersExtensionHostWorker()
      }
      if (pathName.endsWith('terminalWorkerMain.js') || pathName.endsWith('terminalWorkerMain.ts')) {
        return GetHeadersTerminalWorker.getHeadersTerminalWorker()
      }
      if (pathName.endsWith('syntaxHighlightingWorkerMain.js') || pathName.endsWith('syntaxHighlightingWorkerMain.ts')) {
        return GetHeadersSyntaxHighlightingWorker.getHeadersSyntaxHighlightingWorker()
      }
      if (pathName.endsWith('embedsWorkerMain.js') || pathName.endsWith('embedsWorkerMain.ts')) {
        return GetHeadersEmbedsWorker.getHeadersEmbedsWorker()
      }
      if (pathName.endsWith('WorkerMain.js') || pathName.endsWith('WorkerMain.ts')) {
        return GetHeadersOtherWorker.getHeadersOtherWorker(pathName)
      }
      return GetHeadersDefault.getHeadersDefault()
    default:
      return GetHeadersDefault.getHeadersDefault()
  }
}

export const getHeaders = (absolutePath, pathName) => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers = {
    [HttpHeader.ContentType]: mime,
  }
  const extraHeaders = getExtraHeaders(pathName, extension)
  return {
    ...headers,
    ...extraHeaders,
  }
}
