import { createReadStream } from 'node:fs'
import * as Assert from '../Assert/Assert.js'
import { CompatServerResponse } from '../CompatServerResponse/CompatServerResponse.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as PipelineResponse from '../PipelineResponse/PipelineResponse.js'

export const send = async (request, socket, filePath) => {
  const response = new CompatServerResponse(request, socket)
  try {
    Assert.object(request)
    Assert.object(socket)
    Assert.string(filePath)
    response.assignSocket(socket)
    const headers = GetHeaders.getHeaders(filePath)
    response.writeHead(200, headers)
    const stream = createReadStream(filePath)
    await PipelineResponse.pipelineResponse(response, stream)
  } catch (error) {
    console.error(`[response error] ${request.url} ${error}`)
    response.statusCode = 500
    response.end('server error')
  }
}
