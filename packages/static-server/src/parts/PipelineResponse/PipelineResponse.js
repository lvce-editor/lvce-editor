import { pipeline } from 'node:stream/promises'

export const pipelineResponse = async (response, stream) => {
  // const { resolve, promise } = Promise.withResolvers()
  // stream.on('end', resolve)
  // stream.on('data', (x) => {
  //   response.write(x)
  // })
  // await promise
  // response.end()

  await pipeline(stream, response)
}
