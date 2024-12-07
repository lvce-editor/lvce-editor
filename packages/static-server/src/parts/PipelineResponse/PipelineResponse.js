import { pipeline } from 'node:stream/promises'

export const pipelineResponse = async (response, stream) => {
  await pipeline(stream, response)
}
