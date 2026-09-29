import { pipeline } from 'node:stream/promises'
import type { ServerResponse } from 'node:http'
import type { Readable } from 'node:stream'

export const pipelineResponse = async (response: ServerResponse, stream: Readable): Promise<void> => {
  await pipeline(stream, response)
}
