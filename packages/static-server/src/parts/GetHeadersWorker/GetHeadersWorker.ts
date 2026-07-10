import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getHeadersWorker = (mime: string, etag: string, defaultCachingHeader: string, csp: string) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.ContentSecurityPolicy]: csp,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
