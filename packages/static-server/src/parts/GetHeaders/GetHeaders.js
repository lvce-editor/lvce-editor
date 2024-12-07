import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as Path from '../Path/Path.js'

export const getHeaders = (absolutePath, etag) => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers = {
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.Connection]: 'close',
    [HttpHeader.Etag]: etag,
  }
  return {
    ...headers,
  }
}
