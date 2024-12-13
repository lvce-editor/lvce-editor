import * as Connection from '../Connection/Connection.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersDefault = (mime, etag, defaultCachingHeader) => {
  return {
    [HttpHeader.CacheControl]: defaultCachingHeader,
    [HttpHeader.Connection]: Connection.Close,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
