import * as Files from '../Files/Files.ts'
import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import { isSupportedMethod } from '../IsSupportedMethod/IsSupportedMethod.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import type { Request } from '../Request/Request.ts'

export const getResponseInfoProduction = (request: Request) => {
  if (!isSupportedMethod(request.method)) {
    return {
      absolutePath: '',
      status: HttpStatusCode.MethodNotAllowed,
      headers: {},
    }
  }
  const pathName = request.path || request.url?.split('?')[0] || '/'
  const result = Files.get(pathName)
  if (!result) {
    return {
      absolutePath: '',
      status: HttpStatusCode.NotFound,
      headers: {},
    }
  }
  const headers = result.headers || result
  const etag = result.etag || headers[HttpHeader.Etag] || Files.etag
  if (etag && MatchesEtag.matchesEtag(request, etag)) {
    return {
      absolutePath: '',
      status: HttpStatusCode.NotModifed,
      headers: {
        [HttpHeader.Etag]: etag,
      },
    }
  }
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathName)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
