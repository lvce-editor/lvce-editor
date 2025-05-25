import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as GetHeadersAboutWorker from '../GetHeadersAboutWorker/GetHeadersAboutWorker.js'
import * as GetHeadersColorPickerWorker from '../GetHeadersColorPickerWorker/GetHeadersColorPickerWorker.js'
import * as GetHeadersDebugWorker from '../GetHeadersDebugWorker/GetHeadersDebugWorker.js'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersDocument from '../GetHeadersDocument/GetHeadersDocument.js'
import * as GetHeadersEditorWorker from '../GetHeadersEditorWorker/GetHeadersEditorWorker.js'
import * as GetHeadersErrorWorker from '../GetHeadersErrorWorker/GetHeadersErrorWorker.js'
import * as GetHeadersExplorerWorker from '../GetHeadersExplorerWorker/GetHeadersExplorerWorker.js'
import * as GetHeadersExtensionDetailViewWorker from '../GetHeadersExtensionDetailViewWorker/GetHeadersExtensionDetailViewWorker.js'
import * as GetHeadersExtensionHostSubWorker from '../GetHeadersExtensionHostSubWorker/GetHeadersExtensionHostSubWorker.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersExtensionSearchViewWorker from '../GetHeadersExtensionSearchViewWorker/GetHeadersExtensionSearchViewWorker.js'
import * as GetHeadersFileSearchWorker from '../GetHeadersFileSearchWorker/GetHeadersFileSearchWorker.js'
import * as GetHeadersFileSystemWorker from '../GetHeadersFileSystemWorker/GetHeadersFileSystemWorker.js'
import * as GetHeadersIframeWorker from '../GetHeadersIframeWorker/GetHeadersIframeWorker.js'
import * as GetHeadersKeyBindingsViewWorker from '../GetHeadersKeyBindingsViewWorker/GetHeadersKeyBindingsViewWorker.js'
import * as GetHeadersMarkdownWorker from '../GetHeadersMarkdownWorker/GetHeadersMarkdownWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersSearchViewWorker from '../GetHeadersSearchViewWorker/GetHeadersSearchViewWorker.js'
import * as GetHeadersSourceControlWorker from '../GetHeadersSourceControlWorker/GetHeadersSourceControlWorker.js'
import * as GetHeadersSyntaxHighlightingWorker from '../GetHeadersSyntaxHighlightingWorker/GetHeadersSyntaxHighlightingWorker.js'
import * as GetHeadersTerminalWorker from '../GetHeadersTerminalWorker/GetHeadersTerminalWorker.js'
import * as GetHeadersTestWorker from '../GetHeadersTestWorker/GetHeadersTestWorker.js'
import * as GetHeadersTextSearchWorker from '../GetHeadersTextSearchWorker/GetHeadersTextSearchWorker.js'
import * as GetHeadersTitleBarWorker from '../GetHeadersTitleBarWorker/GetHeadersTitleBarWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as Path from '../Path/Path.js'

export const getHeaders = (absolutePath, etag, isImmutable) => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const defaultCachingHeader = isImmutable ? CachingHeaders.OneYear : CachingHeaders.NoCache
  if (absolutePath.endsWith('index.html')) {
    return GetHeadersDocument.getHeadersDocument(mime, etag)
  }
  if (absolutePath.endsWith('rendererWorkerMain.js')) {
    return GetHeadersRendererWorker.getHeadersRendererWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostWorkerMain.js')) {
    return GetHeadersExtensionHostWorker.getHeadersExtensionHostWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('terminalWorkerMain.js')) {
    return GetHeadersTerminalWorker.getHeadersTerminalWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('editorWorkerMain.js')) {
    return GetHeadersEditorWorker.getHeadersEditorWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionSearchViewWorkerMain.js')) {
    return GetHeadersExtensionSearchViewWorker.getHeadersExtensionSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('errorWorkerMain.js')) {
    return GetHeadersErrorWorker.getHeadersErrorWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionDetailViewWorkerMain.js')) {
    return GetHeadersExtensionDetailViewWorker.getHeadersExtensionDetailViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('iframeWorkerMain.js')) {
    return GetHeadersIframeWorker.getHeadersIframeWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('fileSearchWorkerMain.js')) {
    return GetHeadersFileSearchWorker.getHeadersFileSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('fileSystemWorkerMain.js')) {
    return GetHeadersFileSystemWorker.getHeadersFileSystemWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('textSearchWorkerMain.js')) {
    return GetHeadersTextSearchWorker.getHeadersTextSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('aboutWorkerMain.js')) {
    return GetHeadersAboutWorker.getHeadersAboutWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('sourceControlWorkerMain.js')) {
    return GetHeadersSourceControlWorker.getHeadersSourceControlWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('explorerViewWorkerMain.js')) {
    return GetHeadersExplorerWorker.getHeadersExplorerWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('testWorkerMain.js')) {
    return GetHeadersTestWorker.getHeadersTestWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('debugWorkerMain.js')) {
    return GetHeadersDebugWorker.getHeadersDebugWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('syntaxHighlightingWorkerMain.js')) {
    return GetHeadersSyntaxHighlightingWorker.getHeadersSyntaxHighlightingWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('searchViewWorkerMain.js')) {
    return GetHeadersSearchViewWorker.getHeadersSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostSubWorkerMain.js')) {
    return GetHeadersExtensionHostSubWorker.getHeadersExtensionHostSubWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('keyBindingsViewWorkerMain.js')) {
    return GetHeadersKeyBindingsViewWorker.getHeadersKeyBindingsViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('markdownWorkerMain.js')) {
    return GetHeadersMarkdownWorker.getHeadersMarkdownWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('titleBarWorkerMain.js')) {
    return GetHeadersTitleBarWorker.getHeadersTitleBarWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('colorPickerWorkerMain.js')) {
    return GetHeadersColorPickerWorker.getHeadersColorPickerWorker(mime, etag, defaultCachingHeader)
  }
  return GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader)
}
