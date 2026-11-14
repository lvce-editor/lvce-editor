import type { Request } from '../Request/Request.ts'
import * as Files from '../Files/Files.ts'
import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import { isSupportedMethod } from '../IsSupportedMethod/IsSupportedMethod.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'

const appRoutePattern = /(?:^|\/)(chat|board)\/?$/

interface ResponseInfo {
  absolutePath: string
  headers: Record<string, string>
  status: number
}

export const getResponseInfoProduction = (request: Request): ResponseInfo => {
  if (!isSupportedMethod(request.method)) {
    return {
      absolutePath: '',
      headers: {},
      status: HttpStatusCode.MethodNotAllowed,
    }
  }
  const pathName = request.path || request.url?.split('?', 1)[0] || '/'
  const appRoute = pathName.match(appRoutePattern)
  const result = Files.get(pathName) || (appRoute && Files.get(`/${appRoute[1]}`))
  if (!result) {
    return {
      absolutePath: '',
      headers: {},
      status: HttpStatusCode.NotFound,
    }
  }
  const headers = result.headers || result
  const etag = result.etag || headers[HttpHeader.Etag] || Files.etag
  if (etag && MatchesEtag.matchesEtag(request, etag)) {
    return {
      absolutePath: '',
      headers: {
        [HttpHeader.Etag]: etag,
      },
      status: HttpStatusCode.NotModifed,
    }
  }
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathName)
  return {
    absolutePath,
    headers,
    status: HttpStatusCode.Ok,
  }
}
