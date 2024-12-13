import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const matchesEtag = (request, etag) => {
  return request.headers[HttpHeader.IfNotMatch] === etag
}
