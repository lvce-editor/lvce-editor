import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getHeadersDefault = (mime: string, etag: string, defaultCachingHeader: string) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
