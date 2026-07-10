import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getHeadersExtensionWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
