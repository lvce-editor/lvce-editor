import { createReadStream } from 'node:fs'
import { CompatServerResponse } from '../CompatServerResponse/CompatServerResponse.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsStreamPrematureCloseError from '../IsStreamPrematureCloseError/IsStreamPrematureCloseError.ts'
import * as PipelineResponse from '../PipelineResponse/PipelineResponse.ts'
import type { OutgoingHttpHeaders } from 'node:http'
import type { Writable } from 'node:stream'
import type { Request } from '../Request/Request.ts'

export const send = async (request: Request, socket: Writable, status: number, headers: OutgoingHttpHeaders, filePath: string): Promise<void> => {
  const response = new CompatServerResponse(request, socket, status, headers)
  if (status === HttpStatusCode.NotFound) {
    response.end('Not Found')
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
