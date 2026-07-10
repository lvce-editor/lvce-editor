import * as GetResponseInfo from '../GetResponseInfo/GetResponseInfo.ts'
import * as IsImmutable from '../IsImmutable/IsImmutable.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import { readFile } from 'node:fs/promises'
import type { Request } from '../Request/Request.ts'

export const getResponse = async (request: Request) => {
  const { absolutePath, status, headers } = await GetResponseInfo.getResponseInfo({ request, isImmutable: IsImmutable.isImmutable })
  const hasBody = request.method !== 'HEAD'
  if (status === HttpStatusCode.MethodNotAllowed) {
    return {
      headers,
      status,
      body: 'Method not Allowed',
      hasBody,
    }
  }
  if (status === HttpStatusCode.NotFound) {
    return {
      headers,
      status,
      body: 'Not Found',
      hasBody,
    }
  }
  if (status === HttpStatusCode.NotModifed) {
    return {
      headers,
      status,
      body: '',
      hasBody: false,
    }
  }
  // TODO maybe read content as blob
  // TODO implment buffering
  try {
    const content = await readFile(absolutePath)
    return {
      headers,
      status,
      body: content,
      hasBody,
    }
  } catch (error) {
    console.error(`[static server] response error at ${request.url} ${error}`)
    return {
      headers: {},
      status: HttpStatusCode.ServerError,
      body: 'Server Error',
      hasBody: true,
    }
  }
}
