import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import { isSupportedMethod } from '../IsSupportedMethod/IsSupportedMethod.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.ts'
import * as NotModifiedResponse from '../NotModifiedResponse/NotModifiedResponse.ts'
import type { Request } from '../Request/Request.ts'

interface GetResponseInfoOptions {
  readonly applicationName?: string
  readonly isImmutable: boolean
  readonly request: Request
}

export const getResponseInfo = async ({ request, isImmutable, applicationName = 'lvce-oss' }: GetResponseInfoOptions) => {
  if (!isSupportedMethod(request.method)) {
    return {
      absolutePath: '',
      status: HttpStatusCode.MethodNotAllowed,
      headers: {},
    }
  }
  const pathname = request.path || request.url?.split('?')[0] || '/'
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
