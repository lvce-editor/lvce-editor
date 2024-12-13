import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as ContentSecurityPolicyExplorerWorker from '../ContentSecurityPolicyExplorerWorker/ContentSecurityPolicyExplorerWorker.js'
import * as ContentSecurityPolicyExtensionDetailViewWorker from '../ContentSecurityPolicyExtensionDetailViewWorker/ContentSecurityPolicyExtensionDetailViewWorker.js'
import * as ContentSecurityPolicyExtensionHostSubWorker from '../ContentSecurityPolicyExtensionHostSubWorker/ContentSecurityPolicyExtensionHostSubWorker.js'
import * as ContentSecurityPolicyExtensionSearchViewWorker from '../ContentSecurityPolicyExtensionSearchViewWorker/ContentSecurityPolicyExtensionSearchViewWorker.js'
import * as ContentSecurityPolicySyntaxHighlightingWorker from '../ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.js'
import * as GetHeadersAboutWorker from '../GetHeadersAboutWorker/GetHeadersAboutWorker.js'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersDocument from '../GetHeadersDocument/GetHeadersDocument.js'
import * as GetHeadersEditorWorker from '../GetHeadersEditorWorker/GetHeadersEditorWorker.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersFileSearchWorker from '../GetHeadersFileSearchWorker/GetHeadersFileSearchWorker.js'
import * as GetHeadersIframeWorker from '../GetHeadersIframeWorker/GetHeadersIframeWorker.js'
import * as GetHeadersKeyBindingsViewWorker from '../GetHeadersKeyBindingsViewWorker/GetHeadersKeyBindingsViewWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersSearchViewWorker from '../GetHeadersSearchViewWorker/GetHeadersSearchViewWorker.js'
import * as GetHeadersTerminalWorker from '../GetHeadersTerminalWorker/GetHeadersTerminalWorker.js'
import * as GetHeadersTestWorker from '../GetHeadersTestWorker/GetHeadersTestWorker.js'
import * as GetHeadersTextSearchWorker from '../GetHeadersTextSearchWorker/GetHeadersTextSearchWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as Path from '../Path/Path.js'

const getHeadersExtensionSearchViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionSearchViewWorker.value)
}

const getHeadersExtensionDetailViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionDetailViewWorker.value)
}

const getHeadersExplorerWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExplorerWorker.value)
}

const getHeadersSyntaxHighlightingWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySyntaxHighlightingWorker.value)
}

const getHeadersExtensionHostSubWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostSubWorker.value)
}

export const getHeaders = (absolutePath, etag, isImmutable) => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const defaultCachingHeader = isImmutable ? CachingHeaders.OneYear : CachingHeaders.NoCache
  if (absolutePath.endsWith('/index.html')) {
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
    return getHeadersExtensionSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionDetailViewWorkerMain.js')) {
    return getHeadersExtensionDetailViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('iframeWorkerMain.js')) {
    return GetHeadersIframeWorker.getHeadersIframeWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('fileSearchWorkerMain.js')) {
    return GetHeadersFileSearchWorker.getHeadersFileSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('textSearchWorkerMain.js')) {
    return GetHeadersTextSearchWorker.getHeadersTextSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('aboutWorkerMain.js')) {
    return GetHeadersAboutWorker.getHeadersAboutWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('explorerViewWorkerMain.js')) {
    return getHeadersExplorerWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('testWorkerMain.js')) {
    return GetHeadersTestWorker.getHeadersTestWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('syntaxHighlightingWorkerMain.js')) {
    return getHeadersSyntaxHighlightingWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('searchViewWorkerMain.js')) {
    return GetHeadersSearchViewWorker.getHeadersSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostSubWorkerMain.js')) {
    return getHeadersExtensionHostSubWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('keyBindingsViewWorkerMain.js')) {
    return GetHeadersKeyBindingsViewWorker.getHeadersKeyBindingsViewWorker(mime, etag, defaultCachingHeader)
  }
  return GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader)
}
