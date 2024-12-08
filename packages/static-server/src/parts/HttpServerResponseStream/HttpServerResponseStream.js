import { createReadStream } from 'node:fs'
import { CompatServerResponse } from '../CompatServerResponse/CompatServerResponse.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as PipelineResponse from '../PipelineResponse/PipelineResponse.js'

export const send = async (request, socket, status, headers, filePath) => {
  const response = new CompatServerResponse(request, socket, status, headers)
  if (status === 404) {
    response.end()
    return
  }
  try {
    const stream = createReadStream(filePath)
    await PipelineResponse.pipelineResponse(response, stream)
  } catch (error) {
    // TODO only do this if headers have not already been sent
    console.error(`[response error] ${request.url} ${error}`)
    response.statusCode = HttpStatusCode.ServerError
    response.end('server error')
  }
}
