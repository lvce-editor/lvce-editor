import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'
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
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicy.ContentSecurityPolicy,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

const getHeadersRendererWorker = (mime, etag) => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.Connection]: 'close',
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicy.ContentSecurityPolicyRendererWorker,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

const getHeadersExtensionHostWorker = (mime, etag) => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.Connection]: 'close',
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicy.ContentSecurityPolicyExtensionHostWorker,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

const getHeadersTerminalWorker = (mime, etag) => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.Connection]: 'close',
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicy.ContentSecurityPolicyTerminalWorker,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

const getHeadersDefault = (mime, etag) => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache, // TODO enable caching in production
    [HttpHeader.Connection]: 'close',
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}

export const getHeaders = (absolutePath, etag) => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  if (absolutePath.endsWith('/index.html')) {
    return getHeadersDocument(mime, etag)
  }
  if (absolutePath.endsWith('rendererWorkerMain.js')) {
    return getHeadersRendererWorker(mime, etag)
  }
  if (absolutePath.endsWith('extensionHostWorkerMain.js')) {
    return getHeadersExtensionHostWorker(mime, etag)
  }
  if (absolutePath.endsWith('terminalWorkerMain.js')) {
    return getHeadersTerminalWorker(mime, etag)
  }
  return getHeadersDefault(mime, etag)
}
