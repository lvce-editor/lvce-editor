import { join } from 'path'
import * as Assert from '../Assert/Assert.ts'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.ts'
import * as HandleRequestTest from '../HandleRequestTest/HandleRequestTest.ts'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.ts'
import * as StaticPath from '../StaticPath/StaticPath.ts'

export const handleRequest = async (socket, request) => {
  if (!request) {
    // socket might have been closed during transfer
    return
  }
  Assert.object(socket)
  Assert.object(request)
  if (request.url.startsWith('/tests')) {
    const staticPath = StaticPath.getStaticPath()
    const indexHtmlPath = join(staticPath, 'index.html')
    return HandleRequestTest.handleRequestTest(socket, request, indexHtmlPath)
  }
  const fileResponse = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, fileResponse)
}
