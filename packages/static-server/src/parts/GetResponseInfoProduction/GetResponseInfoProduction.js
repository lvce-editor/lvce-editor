import * as Files from '../Files/Files.js'
import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.js'

export const getResponseInfoProduction = (request) => {
  const pathName = request.url
  const result = Files.get(pathName)
  if (!result) {
    return {
      absolutePath: '',
      status: HttpStatusCode.NotFound,
      headers: {},
    }
  }
  if (MatchesEtag.matchesEtag(request, result.etag)) {
    return {
      absolutePath: '',
      status: HttpStatusCode.NotModifed,
      headers: {
        [HttpHeader.Etag]: result.etag,
      },
    }
  }
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathName)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers: result.headers,
  }
}
