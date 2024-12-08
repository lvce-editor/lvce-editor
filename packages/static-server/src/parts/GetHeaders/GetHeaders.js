import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as ContentSecurityPolicyAboutWorker from '../ContentSecurityPolicyAboutWorker/ContentSecurityPolicyAboutWorker.js'
import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.js'
import * as ContentSecurityPolicyEditorWorker from '../ContentSecurityPolicyEditorWorker/ContentSecurityPolicyEditorWorker.js'
import * as ContentSecurityPolicyExtensionHostWorker from '../ContentSecurityPolicyExtensionHostWorker/ContentSecurityPolicyExtensionHostWorker.js'
import * as ContentSecurityPolicyFileSearchWorker from '../ContentSecurityPolicyFileSearchWorker/ContentSecurityPolicyFileSearchWorker.js'
import * as ContentSecurityPolicyIframeWorker from '../ContentSecurityPolicyIframeWorker/ContentSecurityPolicyIframeWorker.js'
import * as ContentSecurityPolicyRendererWorker from '../ContentSecurityPolicyRendererWorker/ContentSecurityPolicyRendererWorker.js'
import * as ContentSecurityPolicySearchViewWorker from '../ContentSecurityPolicySearchViewWorker/ContentSecurityPolicySearchViewWorker.js'
import * as ContentSecurityPolicySyntaxHighlightingWorker from '../ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.js'
import * as ContentSecurityPolicyTerminalWorker from '../ContentSecurityPolicyTerminalWorker/ContentSecurityPolicyTerminalWorker.js'
import * as ContentSecurityPolicyTestWorker from '../ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.js'
import * as ContentSecurityPolicyTextSearchWorker from '../ContentSecurityPolicyTextSearchWorker/ContentSecurityPolicyTextSearchWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as Path from '../Path/Path.js'

const getHeadersDocument = (mime, etag) => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.Connection]: 'close',
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyDocument.value,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

const getHeadersWorker = (mime, etag, defaultCachingHeader, csp) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.Connection]: 'close',
    [HttpHeader.ContentSecurityPolicy]: csp,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

const getHeadersRendererWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyRendererWorker.value)
}

const getHeadersExtensionHostWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostWorker.value)
}

const getHeadersTerminalWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTerminalWorker.value)
}

const getHeadersEditorWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyEditorWorker.value)
}

const getHeadersTestWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTestWorker.value)
}

const getHeadersAboutWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyAboutWorker.value)
}

const getHeadersFileSearchWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFileSearchWorker.value)
}

const getHeadersTextSearchWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTextSearchWorker.value)
}

const getHeadersSyntaxHighlightingWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySyntaxHighlightingWorker.value)
}

const getHeadersIframeWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIframeWorker.value)
}

const getHeadersSearchViewWorker = (mime, etag, defaultCachingHeader) => {
  return getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySearchViewWorker.value)
}

const getHeadersDefault = (mime, etag, defaultCachingHeader) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.Connection]: 'close',
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
    return getHeadersDocument(mime, etag)
  }
  if (absolutePath.endsWith('rendererWorkerMain.js')) {
    return getHeadersRendererWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostWorkerMain.js')) {
    return getHeadersExtensionHostWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('terminalWorkerMain.js')) {
    return getHeadersTerminalWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('editorWorkerMain.js')) {
    return getHeadersEditorWorker(mime, etag, defaultCachingHeader)
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
  if (absolutePath.endsWith('testWorkerMain.js')) {
    return getHeadersTestWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('syntaxHighlightingWorkerMain.js')) {
    return getHeadersSyntaxHighlightingWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('searchViewWorkerMain.js')) {
    return getHeadersSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  return getHeadersDefault(mime, etag, defaultCachingHeader)
}
