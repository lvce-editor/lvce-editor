import { createReadStream } from 'node:fs'
import { CompatServerResponse } from '../CompatServerResponse/CompatServerResponse.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsStreamPrematureCloseError from '../IsStreamPrematureCloseError/IsStreamPrematureCloseError.js'
import * as PipelineResponse from '../PipelineResponse/PipelineResponse.js'

export const send = async (request, socket, status, headers, filePath) => {
  const response = new CompatServerResponse(request, socket, status, headers)
  if (status === HttpStatusCode.NotFound) {
    response.end()
    return
  }
  if (status === HttpStatusCode.NotModifed) {
    response.end()
    return
  }
  try {
    const stream = createReadStream(filePath)
    await PipelineResponse.pipelineResponse(response, stream)
  } catch (error) {
    if (IsStreamPrematureCloseError.isStreamPrematureCloseError(error)) {
      return
    }
    // TODO only do this if headers have not already been sent
    console.error(`[static server] response error at ${request.url} ${error}`)
    response.statusCode = HttpStatusCode.ServerError
    response.end('server error')
  }
}
