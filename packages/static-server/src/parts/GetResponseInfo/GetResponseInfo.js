import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as Path from '../Path/Path.js'
import { STATIC } from '../Static/Static.js'

export const getResponseInfo = async (request) => {
  const pathname = request.url
  const absolutePath = Path.join(STATIC, pathname)
  const etag = await GetPathEtag.getPathEtag(absolutePath)
  if (request.headers['if-none-match'] === etag) {
    return {
      absolutePath,
      status: HttpStatusCode.NotModifed,
      headers: {
        [HttpHeader.Connection]: 'close',
      },
    }
  }
  const headers = GetHeaders.getHeaders(absolutePath, etag)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
