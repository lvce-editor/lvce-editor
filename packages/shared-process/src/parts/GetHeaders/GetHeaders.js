import { basename, extname } from 'path'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetHeadersAboutWorker from '../GetHeadersAboutWorker/GetHeadersAboutWorker.js'
import * as GetHeadersDebugWorker from '../GetHeadersDebugWorker/GetHeadersDebugWorker.js'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersEditorWorker from '../GetHeadersEditorWorker/GetHeadersEditorWorker.js'
import * as GetHeadersEmbedsWorker from '../GetHeadersEmbedsWorker/GetHeadersEmbedsWorker.js'
import * as GetHeadersErrorWorker from '../GetHeadersErrorWorker/GetHeadersErrorWorker.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersFileSearchWorker from '../GetHeadersFileSearchWorker/GetHeadersFileSearchWorker.js'
import * as GetHeadersColorPickerWorker from '../GetHeadersColorPickerWorker/GetHeadersColorPickerWorker.js'
import * as GetHeadersFileSystemWorker from '../GetHeadersFileSystemWorker/GetHeadersFileSystemWorker.js'
import * as GetHeadersIframeInspectorWorker from '../GetHeadersIframeInspectorWorker/GetHeadersIframeInspectorWorker.js'
import * as GetHeadersIframeWorker from '../GetHeadersIframeWorker/GetHeadersIframeWorker.js'
import * as GetHeadersMainFrame from '../GetHeadersMainFrame/GetHeadersMainFrame.js'
import * as GetHeadersMarkdownWorker from '../GetHeadersMarkdownWorker/GetHeadersMarkdownWorker.js'
import * as GetHeadersOtherWorker from '../GetHeadersOtherWorker/GetHeadersOtherWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersSearchWorker from '../GetHeadersSearchWorker/GetHeadersSearchWorker.js'
import * as GetHeadersSourceControlWorker from '../GetHeadersSourceControlWorker/GetHeadersSourceControlWorker.js'
import * as GetHeadersSyntaxHighlightingWorker from '../GetHeadersSyntaxHighlightingWorker/GetHeadersSyntaxHighlightingWorker.js'
import * as GetHeadersTerminalWorker from '../GetHeadersTerminalWorker/GetHeadersTerminalWorker.js'
import * as GetHeadersTestWorker from '../GetHeadersTestWorker/GetHeadersTestWorker.js'
import * as GetHeadersTextSearchWorker from '../GetHeadersTextSearchWorker/GetHeadersTextSearchWorker.js'
import * as GetHeadersTitleBarWorker from '../GetHeadersTitleBarWorker/GetHeadersTitleBarWorker.js'
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
        case 'iframeWorkerMain.js':
          return GetHeadersIframeWorker.getHeadersIframeWorker()
        case 'fileSearchWorkerMain.js':
          return GetHeadersFileSearchWorker.getHeadersFileSearchWorker()
        case 'iframeInspectorWorkerMain.js':
          return GetHeadersIframeInspectorWorker.getHeadersIframeInspectorWorker()
        case 'fileSystemWorkerMain.js':
          return GetHeadersFileSystemWorker.getHeadersFileSystemWorker()
        case 'textSearchWorkerMain.js':
          return GetHeadersTextSearchWorker.getHeadersFileSearchWorker()
        case 'errorWorkerMain.js':
          return GetHeadersErrorWorker.getHeadersErrorWorker()
        case 'aboutWorkerMain.js':
          return GetHeadersAboutWorker.getHeadersAboutWorker()
        case 'markdownWorkerMain.js':
          return GetHeadersMarkdownWorker.getHeadersMarkdownWorker()
        case 'titleBarWorkerMain.js':
          return GetHeadersTitleBarWorker.getHeadersTitleBarWorker()
        case 'debugWorkerMain.js':
          return GetHeadersDebugWorker.getHeadersDebugWorker()
        case 'sourceControlWorkerMain.js':
          return GetHeadersSourceControlWorker.getHeadersSourceControlWorker()
        case 'colorPickerWorkerMain.js':
          return GetHeadersColorPickerWorker.getHeadersColorPickerWorker()
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
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
  }
  const extraHeaders = getExtraHeaders(pathName, extension)
  return {
    ...headers,
    ...extraHeaders,
  }
}
