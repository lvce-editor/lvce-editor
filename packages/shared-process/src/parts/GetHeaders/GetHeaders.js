import { basename, extname } from 'path'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersEditorWorker from '../GetHeadersEditorWorker/GetHeadersEditorWorker.js'
import * as GetHeadersEmbedsWorker from '../GetHeadersEmbedsWorker/GetHeadersEmbedsWorker.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersMainFrame from '../GetHeadersMainFrame/GetHeadersMainFrame.js'
import * as GetHeadersOtherWorker from '../GetHeadersOtherWorker/GetHeadersOtherWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersSearchWorker from '../GetHeadersSearchWorker/GetHeadersSearchWorker.js'
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
      const baseName = basename(pathName)
      switch (baseName) {
        case 'editorWorkerMain.js':
        case 'editorWorkerMain.ts':
          return GetHeadersEditorWorker.getHeadersEditorWorker()
        case 'testWorkerMain.js':
        case 'testWorkerMain.ts':
          return GetHeadersTestWorker.getHeadersExtensionHostWorker() // TODO
        case 'rendererWorkerMain.js':
        case 'rendererWorkerMain.ts':
          return GetHeadersRendererWorker.getHeadersRendererWorker()
        case 'extensionHostWorkerMain.js':
        case 'extensionHostWorkerMain.ts':
          return GetHeadersExtensionHostWorker.getHeadersExtensionHostWorker()
        case 'terminalWorkerMain.js':
        case 'terminalWorkerMain.ts':
          return GetHeadersTerminalWorker.getHeadersTerminalWorker()
        case 'syntaxHighlightingWorkerMain.js':
        case 'syntaxHighlightingWorkerMain.ts':
          return GetHeadersSyntaxHighlightingWorker.getHeadersSyntaxHighlightingWorker()
        case 'embedsWorkerMain.js':
        case 'embedsWorkerMain.ts':
          return GetHeadersEmbedsWorker.getHeadersEmbedsWorker()
        case 'searchWorkerMain.js':
        case 'searchWorkerMain.ts':
          return GetHeadersSearchWorker.getHeadersSearchWorker()
        default:
          if (pathName.endsWith('WorkerMain.js') || pathName.endsWith('WorkerMain.ts')) {
            return GetHeadersOtherWorker.getHeadersOtherWorker(pathName)
          }
          return GetHeadersDefault.getHeadersDefault()
      }
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
