import { join } from 'path'
import * as Assert from '../Assert/Assert.ts'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.ts'
import * as GetTestRequestResponse from '../GetTestRequestResponse/GetTestRequestResponse.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as StaticPath from '../StaticPath/StaticPath.ts'

const toHttpResponse = (request: any, response: any): any => {
  const { body, init } = response
  return {
    body,
    hasBody: request.method !== 'HEAD' && init.status !== HttpStatusCode.NotModifed,
    headers: init.headers || {},
    status: init.status,
  }
}

export const handleRequest = async (request: any): Promise<any> => {
  Assert.object(request)
  if (request.url.startsWith('/tests')) {
    const staticPath = StaticPath.getStaticPath()
    const indexHtmlPath = join(staticPath, 'index.html')
    const response = await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)
    return toHttpResponse(request, response)
  }
  const response = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  return toHttpResponse(request, response)
}
