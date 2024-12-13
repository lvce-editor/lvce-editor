import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as Connection from '../Connection/Connection.js'
import * as ContentSecurityPolicyAboutWorker from '../ContentSecurityPolicyAboutWorker/ContentSecurityPolicyAboutWorker.js'
import * as ContentSecurityPolicyEditorWorker from '../ContentSecurityPolicyEditorWorker/ContentSecurityPolicyEditorWorker.js'
import * as ContentSecurityPolicyExplorerWorker from '../ContentSecurityPolicyExplorerWorker/ContentSecurityPolicyExplorerWorker.js'
import * as ContentSecurityPolicyExtensionDetailViewWorker from '../ContentSecurityPolicyExtensionDetailViewWorker/ContentSecurityPolicyExtensionDetailViewWorker.js'
import * as ContentSecurityPolicyExtensionHostSubWorker from '../ContentSecurityPolicyExtensionHostSubWorker/ContentSecurityPolicyExtensionHostSubWorker.js'
import * as ContentSecurityPolicyExtensionSearchViewWorker from '../ContentSecurityPolicyExtensionSearchViewWorker/ContentSecurityPolicyExtensionSearchViewWorker.js'
import * as ContentSecurityPolicyFileSearchWorker from '../ContentSecurityPolicyFileSearchWorker/ContentSecurityPolicyFileSearchWorker.js'
import * as ContentSecurityPolicyIframeWorker from '../ContentSecurityPolicyIframeWorker/ContentSecurityPolicyIframeWorker.js'
import * as ContentSecurityPolicyKeyBindingsWorker from '../ContentSecurityPolicyKeyBindingsWorker/ContentSecurityPolicyKeyBindingsWorker.js'
import * as ContentSecurityPolicySearchViewWorker from '../ContentSecurityPolicySearchViewWorker/ContentSecurityPolicySearchViewWorker.js'
import * as ContentSecurityPolicySyntaxHighlightingWorker from '../ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.js'
import * as ContentSecurityPolicyTerminalWorker from '../ContentSecurityPolicyTerminalWorker/ContentSecurityPolicyTerminalWorker.js'
import * as ContentSecurityPolicyTestWorker from '../ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.js'
import * as ContentSecurityPolicyTextSearchWorker from '../ContentSecurityPolicyTextSearchWorker/ContentSecurityPolicyTextSearchWorker.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetHeadersDocument from '../GetHeadersDocument/GetHeadersDocument.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as Path from '../Path/Path.js'

const getHeadersExtensionSearchViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionSearchViewWorker.value)
}

const getHeadersExtensionDetailViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionDetailViewWorker.value)
}

const getHeadersTerminalWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTerminalWorker.value)
}

const getHeadersEditorWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyEditorWorker.value)
}

const getHeadersExplorerWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExplorerWorker.value)
}

const getHeadersTestWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTestWorker.value)
}

const getHeadersAboutWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyAboutWorker.value)
}

const getHeadersFileSearchWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFileSearchWorker.value)
}

const getHeadersTextSearchWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTextSearchWorker.value)
}

const getHeadersSyntaxHighlightingWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySyntaxHighlightingWorker.value)
}

const getHeadersIframeWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIframeWorker.value)
}

const getHeadersSearchViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySearchViewWorker.value)
}

const getHeadersExtensionHostSubWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostSubWorker.value)
}

const getHeadersKeyBindingsViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyKeyBindingsWorker.value)
}

const getHeadersDefault = (mime, etag, defaultCachingHeader) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.Connection]: Connection.Close,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
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
    return getHeadersTerminalWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('editorWorkerMain.js')) {
    return getHeadersEditorWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionSearchViewWorkerMain.js')) {
    return getHeadersExtensionSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionDetailViewWorkerMain.js')) {
    return getHeadersExtensionDetailViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('iframeWorkerMain.js')) {
    return getHeadersIframeWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('fileSearchWorkerMain.js')) {
    return getHeadersFileSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('textSearchWorkerMain.js')) {
    return getHeadersTextSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('aboutWorkerMain.js')) {
    return getHeadersAboutWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('explorerViewWorkerMain.js')) {
    return getHeadersExplorerWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('testWorkerMain.js')) {
    return getHeadersTestWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('syntaxHighlightingWorkerMain.js')) {
    return getHeadersSyntaxHighlightingWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('searchViewWorkerMain.js')) {
    return getHeadersSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostSubWorkerMain.js')) {
    return getHeadersExtensionHostSubWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('keyBindingsViewWorkerMain.js')) {
    return getHeadersKeyBindingsViewWorker(mime, etag, defaultCachingHeader)
  }
  return getHeadersDefault(mime, etag, defaultCachingHeader)
}
