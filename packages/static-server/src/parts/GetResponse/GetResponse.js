import * as GetResponseInfo from '../GetResponseInfo/GetResponseInfo.js'
import * as IsImmutable from '../IsImmutable/IsImmutable.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import { readFile } from 'node:fs/promises'

export const getResponse = async (message) => {
  const { absolutePath, status, headers } = await GetResponseInfo.getResponseInfo(message, IsImmutable.isImmutable)
  if (status === HttpStatusCode.NotModifed) {
    return {
      headers,
      status,
      body: '',
    }
  }
  // TODO implment buffering
  try {
    const content = await readFile(absolutePath)
    return {
      headers,
      status,
      body: content,
    }
  } catch (error) {
    console.error(`[static server] response error at ${message.url} ${error}`)
    return {
      headers: {},
      status: HttpStatusCode.ServerError,
      body: 'Server Error',
    }
  }
}
