import { createReadStream } from 'node:fs'
import { CompatServerResponse } from '../CompatServerResponse/CompatServerResponse.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as PipelineResponse from '../PipelineResponse/PipelineResponse.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

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
    // @ts-ignore
    if (error && error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE) {
      return
    }
    // TODO only do this if headers have not already been sent
    console.error(`[static server] response error at ${request.url} ${error}`)
    response.statusCode = HttpStatusCode.ServerError
    response.end('server error')
  }
}
