import { join } from 'node:path'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import { STATIC } from '../Static/Static.js'

export const getResponseInfo = async (request) => {
  const pathname = request.url
  const absolutePath = join(STATIC, pathname)
  const headers = GetHeaders.getHeaders(absolutePath)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
