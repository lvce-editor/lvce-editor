import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersExtensionWorker = (mime, etag, defaultCachingHeader) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
