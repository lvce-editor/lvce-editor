import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import type { Request } from '../Request/Request.ts'

export const matchesEtag = (request: Request, etag: string): boolean => {
  return request.headers?.[HttpHeader.IfNotMatch] === etag
}
