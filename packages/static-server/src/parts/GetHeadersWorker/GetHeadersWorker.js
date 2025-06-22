import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersWorker = (mime, etag, defaultCachingHeader, csp) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.ContentSecurityPolicy]: csp,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
