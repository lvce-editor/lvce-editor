import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.js'

export const getResponseInfo = async (request, isImmutable) => {
  const pathname = request.url
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathname)
  const etag = await GetPathEtag.getPathEtag(absolutePath)
  if (!etag) {
    return {
      absolutePath: '',
      status: HttpStatusCode.NotFound,
      headers: {
        [HttpHeader.Connection]: 'close',
      },
    }
  }
  if (MatchesEtag.matchesEtag(request, etag)) {
    return {
      absolutePath,
      status: HttpStatusCode.NotModifed,
      headers: {
        [HttpHeader.Connection]: 'close',
        [HttpHeader.Etag]: etag,
      },
    }
  }
  const headers = GetHeaders.getHeaders(absolutePath, etag, isImmutable)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
