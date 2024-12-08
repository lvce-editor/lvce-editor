import { join } from 'path'
import * as Assert from '../Assert/Assert.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as HandleRequestTest from '../HandleRequestTest/HandleRequestTest.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'
import * as StaticPath from '../StaticPath/StaticPath.js'

export const handleRequest = async (socket, request) => {
  Assert.object(socket)
  Assert.object(request)
  if (request.url === '/tests' || request.url === '/tests/') {
    const staticPath = StaticPath.getStaticPath()
    const indexHtmlPath = join(staticPath, 'index.html')
    return HandleRequestTest.handleRequestTest(socket, request, indexHtmlPath)
  }
  const fileResponse = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, fileResponse)
}
