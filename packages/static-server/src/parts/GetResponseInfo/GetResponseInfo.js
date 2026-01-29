import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import { isSupportedMethod } from '../IsSupportedMethod/IsSupportedMethod.js'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.js'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.js'
import * as NotModifiedResponse from '../NotModifiedResponse/NotModifiedResponse.js'

export const getResponseInfo = async ({ request, isImmutable, applicationName = 'lvce-oss' }) => {
  if (!isSupportedMethod(request.method)) {
    return {
      absolutePath: '',
      status: HttpStatusCode.MethodNotAllowed,
      headers: {},
    }
  }
  const pathname = request.url
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathname)
  const etag = await GetPathEtag.getPathEtag(absolutePath)
  if (!etag) {
    return NotFoundResponse.notFoundResponse
  }
  if (MatchesEtag.matchesEtag(request, etag)) {
    return NotModifiedResponse.notModifiedResponse
  }
  const headers = GetHeaders.getHeaders({ absolutePath, etag, isImmutable, isForElectronProduction: false, applicationName })
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
